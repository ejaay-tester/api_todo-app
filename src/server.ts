import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/mongo"
import todoRoutes from "./routes/todoRoutes"

dotenv.config()

// Creates Express app instances
const app = express()

app.use(express.json())

connectDB()

// Add a health check for (/) route
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
    version: "1.0.0",
  })
})

// Attach JSON Server routes after auth check
app.use("/api", todoRoutes)

// Use Render's port if deployed, otherwise 3001 locally
const PORT = process.env.PORT || 3000

// Start server, bind to 0.0.0.0 for cloud compatibility
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log("MONGO URI: ", process.env.MONGO_URI)
// Creates router based on db.json
// const router = jsonServer.router("db.json")

// Adds default JSON Server middlewares, logger, CORS, static, no-cache
// const middlewares = jsonServer.defaults()

// Applies JSON Server default middleware
// This already includes body parsing behavior
// app.use(middlewares)

// AUTHENTICATION MIDDLEWARE --> app.use((req,res,next) => {})
// Custom middleware runs before router
// app.use((req: Request, res: Response, next: NextFunction) => {
//   if (req.method !== "GET") {
//     const authHeader = req.headers.authorization // Reads Authorization header

//     if (!authHeader || authHeader !== "Bearer mysecrettoken") {
//       // Checks if header is missing OR token is incorrect
//       // If invalid, return 401
//       return res.status(401).json({
//         errorCode: "UNAUTHORIZED",
//         message: "Invalid or missing token",
//       })
//     }
//   }

//   // If valid -> proceed to router
//   next()
// })
