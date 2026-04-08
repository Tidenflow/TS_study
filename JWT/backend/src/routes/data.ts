import express from "express"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// ============================================
// TODO: 获取用户资料（需要登录）
// ============================================
router.get("/profile", authMiddleware, (req, res) => {
  // 任务：
  // 1. 从 req.user 获取当前用户信息
  // 2. 返回用户资料
  
  // 参考答案：
  // const user = req.user
  // res.json({
  //   id: user?.sub,
  //   name: user?.name,
  //   role: user?.role
  // })
  
  // TODO: 请实现
  
  res.json({ message: "TODO: 请实现获取用户资料" })
})

// ============================================
// TODO: 获取私密数据（需要登录）
// ============================================
router.get("/secret", authMiddleware, (req, res) => {
  // 任务：
  // 1. 验证用户角色（可选：仅 admin 可访问）
  // 2. 返回私密数据
  
  // TODO: 请实现
  
  res.json({ 
    message: "TODO: 这是私密数据",
    data: "只有登录用户才能看到"
  })
})

// 公开接口（无需登录）
router.get("/public", (req, res) => {
  res.json({
    message: "这是公开接口，无需登录即可访问"
  })
})

export default router
