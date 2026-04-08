# Session + Cookie 学习项目

> 从零实现 Session + Cookie 认证系统，学习会话管理核心概念

## 项目结构

```
Session_Cookie/
├── backend/                  # 后端服务
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── app.ts            # 主应用入口（已完成）
│       ├── routes/
│       │   ├── auth.ts        # TODO: 登录/登出/用户接口
│       │   └── data.ts        # TODO: 业务接口
│       └── middleware/
│           └── auth.ts        # TODO: 登录验证中间件
└── frontend/                 # 前端演示
    ├── package.json
    ├── vite.config.ts
    └── index.html            # 登录/用户页面（已完成）
```

## 核心概念

| 概念 | 说明 |
|------|------|
| **Cookie** | 浏览器存储的键值对，每次请求自动发送 |
| **Session** | 服务器存储的用户会话信息 |
| **Session ID** | 唯一标识，存放在 Cookie 中 |
| **httpOnly** | 禁止 JS 访问，防止 XSS |
| **sameSite** | CSRF 防护 |

## 启动命令

### 后端

```bash
cd backend
npm install
cp .env.example .env  # 可选：配置环境变量
npm run dev
```

服务器启动在 http://localhost:3000

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端启动在 http://localhost:5173

## 学习任务清单

### 第一阶段：基础认证

- [ ] **Task 1**: 实现登录接口 (`backend/src/routes/auth.ts`)
  - 验证用户名密码 (admin/123456)
  - 创建 Session 存储 userId, username, role
  - 返回登录成功消息

- [ ] **Task 2**: 实现登录验证中间件 (`backend/src/middleware/auth.ts`)
  - 检查 req.session.userId 是否存在
  - 已登录则放行，未登录返回 401

- [ ] **Task 3**: 实现获取当前用户 (`backend/src/routes/auth.ts` - GET /me)
  - 使用中间件保护路由
  - 从 Session 获取用户信息并返回

### 第二阶段：登出与更新

- [ ] **Task 4**: 实现登出接口 (`backend/src/routes/auth.ts` - POST /logout`)
  - 销毁 Session (req.session.destroy)
  - 清除 Cookie (res.clearCookie)
  - 返回登出成功消息

- [ ] **Task 5**: 实现更新用户资料 (`backend/src/routes/auth.ts` - PUT /profile`)
  - 从请求体获取 nickname
  - 更新 Session 中的资料
  - 返回更新成功消息

### 第三阶段：业务接口

- [ ] **Task 6**: 实现订单列表接口 (`backend/src/routes/data.ts` - GET /orders`)
  - 使用中间件保护路由
  - 从 Session 获取 userId
  - 返回模拟订单数据

### 第四阶段（可选）：安全进阶

- [ ] **Task 7**: Session 固定防护
  - 登录成功后调用 `req.session.regenerate()` 重新生成 Session ID

- [ ] **Task 8**: User-Agent 验证
  - 在中间件中检查 User-Agent 是否变化
  - 变化则销毁 Session 防止劫持

## 测试账号

| 用户名 | 密码 |
|--------|------|
| admin  | 123456 |

## 实现顺序建议

1. 先实现 Task 2（中间件），因为其他任务依赖它
2. 再实现 Task 1（登录），因为需要能登录才能测试
3. 实现 Task 3（获取用户信息）
4. 实现 Task 4（登出）
5. 实现 Task 5（更新资料）
6. 实现 Task 6（订单接口）
7. （可选）实现 Task 7、8 安全增强

## 验证方法

### 使用 curl 测试

```bash
# 登录
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}' \
  -v  # 查看 Cookie

# 获取用户信息（带 Cookie）
curl http://localhost:3000/me -b "sid=你的SessionID"

# 登出
curl -X POST http://localhost:3000/logout -b "sid=你的SessionID"
```

### 使用浏览器测试

1. 启动后端 `npm run dev`
2. 启动前端 `npm run dev`
3. 打开 http://localhost:5173
4. 使用 admin/123456 登录
5. 查看浏览器 DevTools > Application > Cookies

## 参考资料

- [Session Cookie 完全指南](../../Gains-Summary/skill_stack/session_cookie_guide.md)
- [express-session 文档](https://www.npmjs.com/package/express-session)
