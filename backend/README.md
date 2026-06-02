# 电商后端 CRUD Demo

Express + TypeScript + TypeORM + SQLite。

## 快速开始

```bash
npm install
npm run dev
```

服务地址: http://localhost:3000

## 项目结构

```
backend/
├── src/
│   ├── app.ts              # Express 入口 + 路由注册
│   ├── data-source.ts      # TypeORM 数据源配置
│   ├── entity/
│   │   ├── User.ts        # 用户实体
│   │   └── Product.ts     # 商品实体
│   ├── routes/
│   │   ├── auth.ts        # 注册/登录
│   │   └── products.ts    # 商品 CRUD
│   ├── middleware/
│   │   ├── auth.ts        # JWT 鉴权
│   │   └── errorHandler.ts
│   └── utils/
│       └── jwt.ts
```

## API

### 认证

```
POST /api/auth/register   { username, password, name }
POST /api/auth/login      { username, password }  → { token }
```

### 商品

```
GET  /api/products                        商品列表（分页）
GET  /api/products/:id                   商品详情
POST /api/products                       新增商品（管理员）
DELETE /api/products/:id                 删除商品（管理员）
```

所有操作需在 Header 携带: `Authorization: Bearer <token>`
