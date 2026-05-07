/**
 * Server.ts is the entry point of the backend application
 * Think of it as a startup file
 * It is responsible for:
 * 1. Starting the server
 * 2. Configuring middleware
 * 3. Connecting services (Database)
 * 4. Loading routes
 */

import express, { Request, Response } from "express" // Web server framework
import dotenv from "dotenv" // Package that loads env variables from .env file
import todoRoutes from "./routes/todoRoutes" // API todo routes
import authRoutes from "./routes/authRoutes" // API auth routes
import { connectDB } from "./config/mongo" // Database connection
import { errorHandler } from "./middleware/errorHandler" // Error handler
import { loggerMiddleware } from "./middleware/logger" // Request tracking logger
// import { limiter } from "./middleware/rateLimiter"

dotenv.config() // loads env variables (example variable: PORT, MONGO_URI, etc...)

const app = express() // Creates Express app instances

/**
 * Define server port
 * If running on Render, it uses process.env.PORT
 * Otherwise, default to 3000 locally
 */
const PORT = process.env.PORT || 3000

// Environment Validation
// Validate required env vars are present at startup - fails fast if missing
// NEVER log secret values - only log their presence or absence.

const requiredEnvVars = ["MONGO_URI", "PORT"]
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`,
  )
  process.exit(1) // Hard stop - don't start a misconfigured server
}

// Log environment variables for debugging
console.log("Environment checking...")
console.log("PORT: ", process.env.PORT)
console.log("MONGO URI: ", process.env.MONGO_URI ? "✅ SET" : "❌ NOT SET") // Never logs the actual value

// Global Middleware
app.use(express.json()) // Allows Expres to parse JSON request bodies

/**
 * Rate Limiting
 * It is best practice to put this near the top so it protects
 * the server as early as possible
 */
// app.use(limiter)

// Logger middleware
app.use(loggerMiddleware)

/**
 * Health check endpoint
 * Used by CI warm-up and monitoring to confirm the server is live/running.
 * Returns 200 only when the server is fully initialized.
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Todo API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
})

/**
 * Routes
 * All authentication routes will start with /api/auth
 * All todo routes will start with /api
 */
app.use("/api/auth", authRoutes)
app.use("/api", todoRoutes)

// 404 handler
app.use("{*splat}", (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

// Error handling (must be last)
app.use(errorHandler)

/**
 * Database & Server
 * Connect to MongoDB and start Express server
 * Listen for incoming requests
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    const isProduction = process.env.NODE_ENV === "production"
    const serverUrl = isProduction
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` // Render injects this automatically
      : `http://localhost:${PORT}`
    console.log(`✅ Server is running on ${serverUrl}`)
  })
})
