import { Router } from "express"
import { isAuthenticated } from "../middleware/auth"

const router = Router()

// ============================================
// TODO: 实现登录接口
// ============================================
router.post("/login", (req, res) => {
  const { username, password } = req.body

  // Task:
  // 1. 验证用户名密码 (username === "admin" && password === "123456")
  // 2. 验证成功后创建 Session，存入 userId, username, role
  // 3. 返回登录成功消息

  // Answer:
  // if (username === "admin" && password === "123456") {
  //   req.session.userId = "123"
  //   req.session.username = username
  //   req.session.role = "admin"
  //   res.json({ message: "登录成功", username })
  // } else {
  //   res.status(401).json({ error: "用户名或密码错误" })
  // }

  res.status(501).json({ error: "TODO: 实现登录逻辑" })
})

// ============================================
// TODO: 实现登出接口
// ============================================
router.post("/logout", (req, res) => {
  // Task:
  // 1. 调用 req.session.destroy() 销毁 Session
  // 2. 清除 Cookie (res.clearCookie("sid"))
  // 3. 返回登出成功消息

  // Answer:
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.status(500).json({ error: "登出失败" })
  //   }
  //   res.clearCookie("sid")
  //   res.json({ message: "登出成功" })
  // })

  res.status(501).json({ error: "TODO: 实现登出逻辑" })
})

// ============================================
// TODO: 获取当前用户信息
// ============================================
router.get("/me", isAuthenticated, (req, res) => {
  // Task:
  // 1. 从 req.session 获取 userId, username, role
  // 2. 返回用户信息

  // Answer:
  // res.json({
  //   userId: req.session.userId,
  //   username: req.session.username,
  //   role: req.session.role
  // })

  res.status(501).json({ error: "TODO: 实现获取用户信息" })
})

// ============================================
// TODO: 更新用户资料
// ============================================
router.put("/profile", isAuthenticated, (req, res) => {
  // Task:
  // 1. 从 req.body 获取要更新的资料 (如 nickname)
  // 2. 更新 req.session 中的对应字段
  // 3. 返回更新成功消息

  // Answer:
  // if (req.body.nickname) {
  //   req.session.nickname = req.body.nickname
  // }
  // res.json({ message: "更新成功" })

  res.status(501).json({ error: "TODO: 实现更新资料" })
})

export default router
