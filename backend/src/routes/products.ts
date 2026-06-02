import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/Product';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { cacheGet, cacheSet, cacheDel, recordDbHit } from '../utils/cache';

const router = Router();
const productRepo = AppDataSource.getRepository(Product);

// GET /api/products  商品列表
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', keyword = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));

    const [products, total] = await productRepo.findAndCount({
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      order: { createdAt: 'DESC' },
    });

    res.json({ data: products, total, page: pageNum, limit: limitNum });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id  商品详情
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError('无效的商品 ID', 400);

    const cacheKey = `product:${id}`;

    // Cache-Aside: 先查缓存
    const { hit, value } = await cacheGet(cacheKey);

    if (hit && value) {
      return res.json({ ...JSON.parse(value), _from: 'cache' });
    }

    // 缓存未命中，查 DB
    const product = await productRepo.findOneBy({ id });
    if (!product) throw new AppError('商品不存在', 404);

    // 写入缓存，TTL 5 分钟
    await cacheSet(cacheKey, JSON.stringify(product), 300);
    await recordDbHit();

    res.json({ ...product, _from: 'db' });
  } catch (err) {
    next(err);
  }
});

// POST /api/products  新增商品
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || price === undefined) throw new AppError('name, price 必填', 400);
    const product = await productRepo.save(productRepo.create({ name, description, price, stock: stock ?? 0 }));
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id  删除商品
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productRepo.delete({ id: Number(req.params.id) });
    if (result.affected === 0) throw new AppError('商品不存在', 404);
    res.json({ message: '删除成功' });
  } catch (err) {
    next(err);
  }
});

export { router as productsRouter };
