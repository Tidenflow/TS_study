import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const userRepo = AppDataSource.getRepository(User);

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
      throw new AppError('username, password, name 必填', 400);
    }
    const exists = await userRepo.findOne({ where: { username } });
    if (exists) throw new AppError('用户名已存在', 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepo.save(userRepo.create({ username, password: hashed, name }));

    res.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new AppError('username, password 必填', 400);

    const user = await userRepo.findOne({ where: { username } });
    if (!user) throw new AppError('用户名或密码错误', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('用户名或密码错误', 401);

    const token = generateToken({ sub: user.id, username: user.username, role: user.role });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
