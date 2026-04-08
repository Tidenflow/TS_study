import express from "express"
import { generateToken } from "../utils/jwt"

const router = express.Router()

// 模拟用户数据（实际应该从数据库查询）
const mockUsers = [
  { id: "1", username: "admin", password: "123456", name: "管理员", role: "admin" },
  { id: "2", username: "user", password: "123456", name: "普通用户", role: "user" }
]

// ============================================
// TODO: 登录接口
// ============================================
router.post("/login", (req, res) => {
  // 任务：
  // 1. 从 req.body 获取 username 和 password
  // 2. 验证用户名密码（这里用模拟数据）
  // 3. 验证成功后调用 generateToken() 生成 token
  // 4. 返回 token 给客户端
  
  // 参考答案：
  // const { username, password } = req.body
  // const user = mockUsers.find(u => u.username === username && u.password === password)
  // if (!user) {
  //   return res.status(401).json({ error: "用户名或密码错误" })
  // }
  // const token = generateToken({
  //   sub: user.id,
  //   name: user.name,
  //   role: user.role
  // })
  // res.json({ token })
  
  // TODO: 请实现
  
  res.json({ message: "TODO: 请实现登录逻辑" })
})

// ============================================
// TODO: 注册接口（简化版）
// ============================================
router.post("/register", (req, res) => {
  // 任务：
  // 1. 从 req.body 获取 username, password, name
  // 2. 简单验证数据有效性
  // 3. 将用户信息添加到 mockUsers（或保存到数据库）
  // 4. 返回成功信息
  
  // TODO: 请实现
  
  res.json({ message: "TODO: 请实现注册逻辑" })
})

export default router
