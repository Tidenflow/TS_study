import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

// 扩展 Request 类型，添加 user 属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string
        name: string
        role: string
      }
    }
  }
}

// ============================================
// TODO: 认证中间件
// ============================================
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 任务：
  // 1. 从请求头获取 Authorization
  // 2. 提取 Bearer token
  // 3. 调用 verifyToken() 验证 token
  // 4. 验证通过则将用户信息挂载到 req.user
  // 5. 验证失败返回 401 错误
  
  // 参考答案：
  // const authHeader = req.headers.authorization
  // if (!authHeader) {
  //   return res.status(401).json({ error: "未提供令牌" })
  // }
  // const token = authHeader.replace("Bearer ", "")
  // try {
  //   const decoded = verifyToken(token)
  //   req.user = decoded
  //   next()
  // } catch (err) {
  //   return res.status(401).json({ error: "令牌无效或已过期" })
  // }
  
  // TODO: 请实现
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res.status(401).json({error: "未提供令牌"});
  }
  const token = authHeader.replace("Bearer ", "");
  try{
    const decoded = verifyToken(token);  //decoded 就是你之前存在 token 里的【载荷 payload】
    req.user = decoded;   //把解析出来的用户信息，挂到请求对象上，让后面的接口能用！
    next();
  } catch(err) {
    return res.status(401).json({ error: "令牌无效或已过期" })
  }
  
  next() // 临时通过，方便测试
}
