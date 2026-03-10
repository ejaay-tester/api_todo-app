/**
 * REGISTER USER
 * STORE PASSWORD SAFELY
 * NEVER STORE RAW PASSWORD
 */

import User from "../models/UserSchema"
import bcrypt from "bcryptjs" // For password hashing
import jwt from "jsonwebtoken" // For authentication token
import { Request, Response } from "express"

// REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" })
    }

    // Pass RAW password - the Pre-save hook in UserSchema handles password hashing
    const user = await User.create({ email, password })

    res.status(201).json({ success: true, data: user })
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message })
  }
}

// LOGIN USER WITH JWT
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const secret = process.env.JWT_SECRET

    // Check if the JWT_SECRET exists
    if (!secret)
      throw new Error(
        "FATAL ERROR: JWT_SECRET is not defined in environment variable (.env)",
      )

    // Find user and explicitly include password if you used "select: false" in schema
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" })
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate Token (using 'id' to match the authMiddleware)
    const token = jwt.sign({ id: user._id }, secret as string, {
      expiresIn: "1h",
    })

    res.status(200).json({ success: true, token })
  } catch (error: any) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
}
