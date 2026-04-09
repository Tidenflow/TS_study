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
// 假设我们的JWT永远不过期下面这个视图函数理论上只会执行一次
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
  const {username, password} = req.body;
  const user = mockUsers.find(e => e.username ===username && e.password === password);
  if(!user) {
    return res.status(401).json({ error: "用户名或密码错误" });
  }
  const JWTtoken = generateToken({
    sub: user.id,
    name: user.name,
    role: user.role
  })
  res.json({JWTtoken});     //执行到这里直接返回给前端
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
   // 1. 从前端获取数据
  const { username, password, name } = req.body;

  // 2. 简单校验：必填项不能为空
  if (!username || !password || !name) {
    return res.status(400).json({ error: "用户名、密码、姓名不能为空" });
  }

  // 3. 检查用户名是否已经被注册
  const hasUser = mockUsers.find(item => item.username === username);
  if (hasUser) {
    return res.status(409).json({ error: "用户名已存在" });
  }

  // 4. 创建新用户（模拟数据库新增）
  const newUser = {
    id: Date.now().toString(), // 用时间戳当唯一ID
    username: username,
    password: password,
    name: name,
    role: "user" // 默认普通用户
  };

  // 5. 加入模拟用户数组
  mockUsers.push(newUser);

  // 6. 返回成功（注册不需要生成token！）
  res.json({
    message: "注册成功",
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name
    }
  });
})

export default router
