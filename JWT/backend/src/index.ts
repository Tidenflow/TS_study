import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth"
import dataRoutes from "./routes/data"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use("/api/auth", authRoutes)
app.use("/api", dataRoutes)

// 根路径
app.get("/", (req, res) => {
  res.json({
    message: "JWT 学习后端服务",
    endpoints: {
      "POST /api/auth/login": "登录",
      "POST /api/auth/register": "注册",
      "GET /api/profile": "获取用户资料（需登录）",
      "GET /api/secret": "获取私密数据（需登录）",
      "GET /api/public": "公开接口（无需登录）"
    }
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET || "未设置"}`)
})
