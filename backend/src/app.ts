import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { AppDataSource } from './data-source';
import { authRouter } from './routes/auth';
import { productsRouter } from './routes/products';
import { scenarioRouter } from './routes/scenario';
import { redis } from './utils/cache';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/scenario', scenarioRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log('✅ 数据库连接成功');
    try {
      await redis.connect();
      console.log('✅ Redis 连接成功');
    } catch (err: any) {
      console.warn('⚠️  Redis 连接失败:', err.message, '(不影响主服务)');
    }
    app.listen(PORT, () => {
      console.log(`🚀 服务已启动: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ 数据库连接失败:', err);
    process.exit(1);
  });

export default app;
