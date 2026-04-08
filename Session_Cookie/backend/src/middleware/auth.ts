import { Request, Response, NextFunction } from "express"

// ============================================
// TODO: 实现登录验证中间件
// ============================================
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Task:
  // 1. 检查 req.session 是否存在且有 userId
  // 2. 如果已登录，调用 next() 继续
  // 3. 如果未登录，返回 401 错误

  // Answer:
  // if (req.session && req.session.userId) {
  //   next()
  // } else {
  //   res.status(401).json({ error: "未登录，请先登录" })
  // }

  res.status(401).json({ error: "TODO: 实现登录验证" })
}
