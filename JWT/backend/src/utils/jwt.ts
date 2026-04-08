import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET || "your-secret-key"

export interface TokenPayload {
  sub: string      // 用户 ID
  name: string     // 用户名
  role: string     // 角色
}

// ============================================
// TODO: 生成 JWT 令牌
// ============================================
export function generateToken(payload: TokenPayload): string {
  // 任务：
  // 1. 使用 jwt.sign() 生成令牌
  // 2. 设置过期时间 expiresIn: "7d"
  // 3. 返回生成的 token
  
  // 参考答案：
  // return jwt.sign(payload, secret, { expiresIn: "7d" })
  
  return "" // TODO: 请实现
}

// ============================================
// TODO: 验证 JWT 令牌
// ============================================
export function verifyToken(token: string): TokenPayload {
  // 任务：
  // 1. 使用 jwt.verify() 验证令牌
  // 2. 返回解析后的 payload
  // 3. 捕获错误并重新抛出（让调用者处理）
  
  // 参考答案：
  // return jwt.verify(token, secret) as TokenPayload
  
  return {} as TokenPayload // TODO: 请实现
}

// ============================================
// TODO: 解码 JWT（不验证，仅提取数据）
// ============================================
export function decodeToken(token: string): TokenPayload | null {
  // 任务：
  // 1. 使用 jwt.decode() 提取 payload
  // 2. 注意：此方法不验证签名，不安全，仅用于调试
  
  // 参考答案：
  // return jwt.decode(token) as TokenPayload | null
  
  return null // TODO: 请实现
}
