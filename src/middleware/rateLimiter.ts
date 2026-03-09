import rateLimit from "express-rate-limit"

// Define a professional rate limiter for your API
export const limiter = rateLimit({
  // 1. Time window: 15 minutes (in milliseconds)
  windowMs: 15 * 60 * 1000,

  // 2. Limit: Maximum of 100 requests per IP address within the windowMs
  limit: 100,

  // 3. Security: Return modern 'RateLimit-*' headers (Draft 7/8)
  // and disable old 'X-RateLimit-*' headers
  standardHeaders: "draft-7",
  legacyHeaders: false,

  // 4. Custom Error Handling: Instead of s string, we return a JSON object
  // and log the event for monitoring
  handler: (req, res, next, options) => {
    // Log the blocked IP for security monitoring
    console.warn(`Rate limit exceeded for IP: ${req.ip}`)

    // Return a structured JSON error response
    res.status(options.statusCode).json({
      success: false,
      status: options.statusCode, // 429 Too Many Requests
      message: "You have exceeded the request limit, Please try again later.",
      retryAfter: Math.ceil(options.windowMs / 1000 / 60) + " minutes",
    })
  },

  // 5. Optimization: Don't count failed request (4xx/5xx) toward the rate limit
  // This prevents "Double Jeopardy" where a user gets blocked for errors
  skipFailedRequests: false,
})
