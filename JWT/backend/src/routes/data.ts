import express from "express"
import { authMiddleware } from "../middleware/auth"
import { UserInfo } from "os"

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
  const user = req.user
  res.json({
    id: user?.sub,
    name: user?.name,
    role: user?.role
  });
})

// ============================================
// TODO: 获取私密数据（需要登录）
// ============================================
router.get("/secret", authMiddleware, (req, res) => {
  // 任务：
  // 1. 验证用户角色（可选：仅 admin 可访问）
  // 2. 返回私密数据
  
  // TODO: 请实现
  const user = req.user;

  // 加一行判断  要不下面user.role !== "admin"报错
  if (!user) {
    return res.status(401).json({ error: "用户未登录" });
  }

  // 可选：仅管理员可以访问此接口
  if (user.role !== "admin") {
    return res.status(403).json({
      error: "权限不足，只有管理员才能访问"
    });
  }

  // 返回私密数据
  res.json({
    message: "这是私密数据",
    data: "只有登录的管理员才能看到",
    user: {
      id: user.sub,
      name: user.name,
      role: user.role
    }
  });
})

// 公开接口（无需登录）
router.get("/public", (req, res) => {
  res.json({
    message: "这是公开接口，无需登录即可访问"
  })
})

export default router
