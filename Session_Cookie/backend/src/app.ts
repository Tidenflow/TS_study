import express from "express"
import session from "express-session"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
)

import authRouter from "./routes/auth"
import dataRouter from "./routes/data"

app.use("/", authRouter)
app.use("/api", dataRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`服务器启动在 ${PORT} 端口`)
})
