import { Router } from "express"
import { isAuthenticated } from "../middleware/auth"

const router = Router()

// ============================================
// TODO: 获取用户订单列表
// ============================================
router.get("/orders", isAuthenticated, (req, res) => {
  // Task:
  // 1. 从 req.session 获取 userId
  // 2. 返回模拟的订单数据

  // Answer:
  // const userId = req.session.userId
  // res.json({
  //   userId,
  //   orders: [
  //     { id: 1, name: "商品 A" },
  //     { id: 2, name: "商品 B" }
  //   ]
  // })

  res.status(501).json({ error: "TODO: 实现获取订单列表" })
})

export default router
