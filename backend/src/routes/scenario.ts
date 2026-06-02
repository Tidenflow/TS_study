import { Router, Request, Response } from 'express';
import {
  activateScenario,
  resetScenario,
  getCacheConfig,
  setCacheEnabled,
  isCacheEnabled,
  getCacheMode,
  setCacheMode,
  getCacheStats,
  resetCacheStats,
  cacheClear,
} from '../utils/cache';

const router = Router();

// GET /api/scenario — 状态总览
router.get('/', (_req: Request, res: Response) => {
  res.json(getCacheConfig());
});

// PUT /api/scenario/enable — 缓存总开关
router.put('/enable', (req: Request, res: Response) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'enabled 必填，值为 true 或 false' });
  }
  setCacheEnabled(enabled);
  res.json({
    message: enabled ? '缓存已启用' : '缓存已禁用',
    ...getCacheConfig(),
  });
});

// PUT /api/scenario/mode — 缓存模式
router.put('/mode', async (req: Request, res: Response) => {
  const { mode } = req.body;
  const valid: Array<'normal' | 'penetration' | 'breakdown' | 'avalanche'> = [
    'normal', 'penetration', 'breakdown', 'avalanche',
  ];
  if (!mode || !valid.includes(mode)) {
    return res.status(400).json({ error: `mode 必填，可选值: ${valid.join(', ')}` });
  }
  try {
    await activateScenario(mode);
    setCacheMode(mode);
    res.json({
      message: `模式已切换: ${mode}`,
      ...getCacheConfig(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/scenario/warmup — 预热缓存（请求商品 1~20 建立缓存）
router.post('/warmup', async (req: Request, res: Response) => {
  const { startId = 1, endId = 20 } = req.body;
  const results: { id: number; cached: boolean }[] = [];
  for (let i = startId; i <= endId; i++) {
    const { cacheGet, cacheSet } = await import('../utils/cache');
    const { AppDataSource } = await import('../data-source');
    const { Product } = await import('../entity/Product');
    const cacheKey = `product:${i}`;
    const { hit } = await cacheGet(cacheKey);
    if (!hit) {
      const product = await AppDataSource.getRepository(Product).findOneBy({ id: i });
      if (product) {
        await cacheSet(cacheKey, JSON.stringify(product), 300);
      }
    }
    results.push({ id: i, cached: !hit });
  }
  const cached = results.filter(r => r.cached).length;
  res.json({ message: `预热完成: ${cached}/${results.length} 个商品已缓存`, total: results.length, cached });
});

// POST /api/scenario/clear — 清空缓存
router.post('/clear', async (req: Request, res: Response) => {
  await cacheClear();
  resetCacheStats();
  res.json({ message: '缓存已清空', ...getCacheConfig() });
});

// POST /api/scenario/reset-stats — 重置统计
router.post('/reset-stats', (_req: Request, res: Response) => {
  resetCacheStats();
  res.json({ message: '统计数据已重置' });
});

// POST /api/scenario/reset — 重置所有（恢复默认状态）
router.post('/reset', async (_req: Request, res: Response) => {
  setCacheEnabled(true);
  await resetScenario();
  resetCacheStats();
  res.json({ message: '已重置为默认状态（缓存开 + Normal）', ...getCacheConfig() });
});

export { router as scenarioRouter };
