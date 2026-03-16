/**
 * Import Express types to define what req, res, and next are
 * Import the JWT library to handle token verification
 */
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "./errorHandler"

/**
 * DEFINE DATA SHAPES
 * Define exactly what a 'User' looks like inside our JWT
 */
interface UserPayLoad {
  id: string
  email: string
  iat: number // issued at -> the exact second the token was created, it's a Unix timestamp (a long string of numbers)
  exp: number // expiration -> the exact second the token will die, after this time the jwt.verify function will auto fail, even if the password is correct
}

/**
 * EXTEND EXPRESS REQUEST
 * Express's default 'Request' doesn't know about 'req.user'
 * We extend it here so TypeScript allows us to attach user data later
 */
export interface AuthRequest extends Request {
  user?: UserPayLoad
}

/**
 * THE AUTHENTICATION MIDDLEWARE
 * This function intercepts the request before it reaches your private routes
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  /**
   * EXTRACT THE TOKEN
   * Expected Header: "Authorization: Bearer <token>"
   * We split by space and take the second element [1]
   */
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]

  /**
   * CHECK ENVIRONMENT VARIABLES
   * If JWT_SERCRET is missing, the server is misconfigured
   * We pass a standard Error to next() to trigger the global error handler
   */
  const secret = process.env.JWT_SECRET
  if (!secret) {
    return next(new Error("FATAL ERROR: JWT_SECRET is not defined!"))
  }

  /**
   * GUARD CLAUSE - NO TOKEN
   * If the user didn't send a token, we stop here and return a 401 status
   */
  if (!token) {
    return next(new UnauthorizedError("No token provided!"))
  }

  try {
    /**
     * VERIFY AND DECODE
     * jwt.verify checks if the token is tampered with or expired
     * We cast it as 'UserPayload' to satisfy TypeScript's strict checks
     */
    const decoded = jwt.verify(token, secret) as UserPayLoad

    /**
     * ATTACH TO REQUEST
     * We save the decoded user data into 'req.user'
     * Any route following this middleware can now access 'req.user.id'
     */
    req.user = decoded
    console.log("Success! User ID is:", req.user) // For testing purposes only

    /**
     * PROCEED
     * next() tells Express to move to the next function/route handler
     */
    next()
  } catch (error) {
    /**
     * HANDLE INVALID TOKENS
     * If verification fails (expired/wrong secret), we catch the error
     * and pass a 401 Unauthorized error to the global handler
     */
    next(new UnauthorizedError("Invalid or expired token!"))
  }
}
