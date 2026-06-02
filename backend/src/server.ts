import 'reflect-metadata';
import { AppDataSource } from './data-source';

// 启动脚本：只负责初始化数据库
AppDataSource.initialize()
  .then(() => {
    console.log('✅ 数据库初始化成功');
    console.log(`   数据库文件: ${AppDataSource.options.database}`);
    console.log('✅ 现在可以运行 npm run dev 启动服务');
  })
  .catch((err) => {
    console.error('❌ 数据库初始化失败:', err);
    process.exit(1);
  });
