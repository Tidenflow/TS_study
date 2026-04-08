# JWT 学习模板仓库

基于 TypeScript + Express 的 JWT 实践项目。

## 项目结构

```
JWT/
├── README.md
├── backend/                  # 后端
│   ├── src/
│   │   ├── utils/
│   │   │   └── jwt.ts        # TODO: JWT 工具函数
│   │   ├── middleware/
│   │   │   └── auth.ts       # TODO: 认证中间件
│   │   ├── routes/
│   │   │   ├── auth.ts       # TODO: 登录/注册接口
│   │   │   └── data.ts       # TODO: 需要验证的接口
│   │   └── index.ts          # 入口文件
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/                 # 前端
    ├── index.html            # TODO: Token 存取、请求拦截
    ├── vite.config.js
    └── package.json
```

## 学习方式

### 1. 启动后端

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. 启动前端（新开终端）

```bash
cd frontend
npm install
npm run dev
```

### 3. 完成 TODO 任务

按顺序完成以下任务：

#### 后端（先完成）

| 顺序 | 文件 | 任务 |
|------|------|------|
| 1 | `backend/src/utils/jwt.ts` | 实现 generateToken、verifyToken、decodeToken |
| 2 | `backend/src/middleware/auth.ts` | 实现认证中间件 |
| 3 | `backend/src/routes/auth.ts` | 实现登录接口 |
| 4 | `backend/src/routes/data.ts` | 实现需要认证的接口 |

#### 前端

| 顺序 | 文件 | 任务 |
|------|------|------|
| 1 | `frontend/index.html` | 实现 saveToken、getStoredToken、clearStoredToken |
| 2 | `frontend/index.html` | 实现 makeAuthRequest（带 Token 的请求） |
| 3 | `frontend/index.html` | 完善 login() 函数 |

## 测试

1. 打开前端 http://localhost:5173
2. 点击"登录"（admin / 123456）
3. 点击"获取用户资料"、"获取私密数据"测试认证
4. 点击"获取公开数据"测试无需认证的接口

## 参考文档

[JWT 完全指南](../../Gains-Summary/skill_stack/jwt_guide.md)
