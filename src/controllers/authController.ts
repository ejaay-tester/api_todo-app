/**
 * REGISTER USER
 * STORE PASSWORD SAFELY
 * NEVER STORE RAW PASSWORD
 */

import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken" // For authentication token
import User from "../models/UserSchema"
import { ResponseHandler } from "../utils/response"
import { asyncHandler } from "../middleware/errorHandler"
import { UnauthorizedError, ValidationError } from "../middleware/errorHandler"
import { registerSchema, loginSchema } from "../schemas/authSchemas"

export class AuthController {
  /**
   * REGISTER USER (POST)
   * - Check if user already exists
   * - Hash password (handled by Mongoose pre-save hook in UserSchema)
   * - Save user to database
   * - Return success response
   */
  registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Validate input using Zod
      const parsed = registerSchema.safeParse(req.body)

      if (!parsed.success) {
        throw new ValidationError(JSON.stringify(parsed.error.issues))
      }

      const { email, password } = parsed.data

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new ValidationError("Email already registered!")
      }

      // Pass RAW password - the Pre-save hook in UserSchema handles password hashing
      const user = await User.create({ email, password })

      // Generate JWT Token (optional, but common practice after registration)
      const secret = process.env.JWT_SECRET

      // Check if the JWT_SECRET exists
      if (!secret) {
        throw new Error(
          "FATAL ERROR: JWT_SECRET is not defined in environment variable (.env)",
        )
      }
      const token = jwt.sign({ id: user._id, email: user.email }, secret, {
        expiresIn: "7h",
      })

      return ResponseHandler.success(res, 201, "User registered successfully", {
        user,
        token,
      })
    },
  )

  /**
   * LOGIN USER WITH JWT (POST)
   * - Validate credentials
   * - Generate JWT token
   * - Return token in response
   */
  loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Validate input using Zod
      const parsed = loginSchema.safeParse(req.body)

      if (!parsed.success) {
        throw new ValidationError(JSON.stringify(parsed.error.issues))
      }

      const { email, password } = parsed.data

      // Generate JWT Token (optional, but common practice after registration)
      const secret = process.env.JWT_SECRET

      // Check if the JWT_SECRET exists
      if (!secret) {
        throw new Error(
          "FATAL ERROR: JWT_SECRET is not defined in environment variable (.env)",
        )
      }

      // Find user and explicitly include password if you used "select: false" in schema
      const user = await User.findOne({ email }).select("+password") // Include password for comparison
      if (!user) {
        throw new UnauthorizedError("Invalid email or password!")
      }

      // Compare provided password with hashed password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        throw new UnauthorizedError("Invalid login credentials")
      }

      // Generate Token (using 'id' to match the authMiddleware)
      const token = jwt.sign({ id: user._id, email: user.email }, secret, {
        expiresIn: "7h",
      })

      return ResponseHandler.success(res, 200, "Login successful", {
        user,
        token,
      })
    },
  )
}
