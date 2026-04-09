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
  
 // TODO: 请实现
 return jwt.sign(
  payload,  //第1部分要存在token里的信息（载荷）
  secret,   // 第2部分：加密密钥（秘钥）
  {
    expiresIn: "7d",
    algorithm: "HS256"  // ✅ 正确写法：algorithm  
  }  //第3部分：配置选项（过期时间等）
 )
}

// ============================================
// TODO: 验证 JWT 令牌
// ============================================
// verifyToken = 验真 + 解密（安全、正式用）
export function verifyToken(token: string): TokenPayload {
  // 任务：
  // 1. 使用 jwt.verify() 验证令牌
  // 2. 返回解析后的 payload
  // 3. 捕获错误并重新抛出（让调用者处理）
  
  // 参考答案：
  // return jwt.verify(token, secret) as TokenPayload
  
  // TODO: 请实现
  return jwt.verify(token, secret) as TokenPayload 
}

// ============================================
// TODO: 解码 JWT（不验证，仅提取数据）
// ============================================
//  decodeToken = 只偷看、不验证（不安全、仅调试用）
export function decodeToken(token: string): TokenPayload | null {
  // 任务：
  // 1. 使用 jwt.decode() 提取 payload
  // 2. 注意：此方法不验证签名，不安全，仅用于调试
  
  // 参考答案：
  // return jwt.decode(token) as TokenPayload | null
  // TODO: 请实现
  return jwt.decode(token) as TokenPayload | null 
}



