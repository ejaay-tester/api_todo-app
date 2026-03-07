// SERVER.TS IS THE ENTRY POINT OF THE BACKEND APPLICATION
// THINK OF IT AS A STARTUP FILE
// IT RESPONSIBLE FOR:
// 1. STARTING THE SERVER
// 2. CONFIGURING MIDDLEWARE
// 3. CONNECTING SERVICES (DATABASE)
// 4. LOADING ROUTES

/**
 * Import required libraries
 * express -> web server framework
 * dotenv -> loads environment variables from .env file
 */
import express from "express"
import dotenv from "dotenv"

/**
 * Import database connection
 */
import { connectDB } from "./config/mongo"

/**
 * Import API routes
 */
import todoRoutes from "./routes/todoRoutes"

/**
 * Load environment variables
 * Example variable:
 * PORT
 * MONGO_URI
 */
dotenv.config()

/**
 * Creates Express app instances
 */
const app = express()

/**
 * Log environment variables for debugging
 */
console.log("Environment checking...")
console.log("PORT: ", process.env.PORT)
console.log("MONGO URI: ", process.env.MONGO_URI)

/**
 * Middleware
 * Allows Express to parse JSON request bodies
 */
app.use(express.json())

/**
 * Connect to MongoDB database
 */
connectDB()

/**
 * Add Health check endpoint
 * Used to confirm the server is running
 */
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
    version: "1.0.0",
  })
})

/**
 * Register API routes
 * All todo routes will start with /api
 */
app.use("/api", todoRoutes)

/**
 * Define server port
 * If running on Render, it uses process.env.PORT
 * Otherwise, default to 3000 locally
 */
const PORT = process.env.PORT || 3000

/**
 * Start Express server
 * Listen for incoming requests
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

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
