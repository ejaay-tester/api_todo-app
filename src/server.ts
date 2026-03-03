import express, { Request, Response, NextFunction } from "express"
import jsonServer from "json-server"
// Creates Express app instances
const app = express()
const router = jsonServer.router("db.json") // Creates router based on db.json
const middlewares = jsonServer.defaults() // Adds default JSON Server middlewares, logger, CORS, static, no-cache

// Applies JSON Server default middleware
// This already includes body parsing behavior
app.use(middlewares)

// AUTHENTICATION MIDDLEWARE --> app.use((req,res,next) => {})
// Custom middleware runs before router
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    const authHeader = req.headers.authorization // Reads Authorization header

    if (!authHeader || authHeader !== "Bearer mysecrettoken") {
      // Checks if header is missing OR token is incorrect
      // If invalid, return 401
      return res.status(401).json({
        errorCode: "UNAUTHORIZED",
        message: "Invalid or missing token",
      })
    }
  }

  // If valid -> proceed to router
  next()
})

// Attach JSON Server routes after auth check
app.use(router)

// Use Render's port if deployed, otherwise 3001 locally
const PORT = Number(process.env.PORT) || 3001

// Start server, bind to 0.0.0.0 for cloud compatibility
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})
