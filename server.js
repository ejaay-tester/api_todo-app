const jsonServer = require("json-server")
const express = require("express")

const app = express()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

app.use(express.json())
app.use(middlewares)

// AUTH MIDDLEWARE
app.use((req, res, next) => {
  if (req.method === "GET") {
    return next() // allow GET without token
  }

  const authHeader = req.headers.authorization

  if (!authHeader || authHeader !== "Bearer mysecrettoken") {
    return res.status(401).json({
      errorCode: "UNAUTHORIZED",
      message: "Invalid or missing token",
    })
  }

  next()
})

app.use(router)

const PORT = process.env.PORT || 3001
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})
