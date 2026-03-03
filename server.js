// Import JSON Server library
// Using it programmatically instead of CLI
const jsonServer = require("json-server")

// Imports Express framework
// Wrap JSON Server inside Express to control middleware
const express = require("express")

// Creates Express app instances
const app = express()

// Creates router based on db.json,
// this automatically generates
// GET /todos, POST /todos, PUT /todos/:id, DELETE /todos/:id
const router = jsonServer.router("db.json")

// Adds default JSON Server middlewares, logger, CORS, static, no-cache
const middlewares = jsonServer.defaults()

// Enables parsing JSON body
// Without this: req.body will be undefined
// app.use(express.json())

// Applies JSON Server default middleware
app.use(middlewares)

// AUTHENTICATION MIDDLEWARE --> app.use((req,res,next) => {})
// Custom middleware runs before router
app.use((req, res, next) => {
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
const PORT = process.env.PORT || 3001

// Start server, bind to 0.0.0.0 for cloud compatibility
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})
