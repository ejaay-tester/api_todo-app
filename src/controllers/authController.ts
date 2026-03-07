/**
 * REGISTER USER
 * STORE PASSWORD SAFELY
 * NEVER STORE RAW PASSWORD
 */

import User from "../models/UserSchema"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"

// REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    password: hashedPassword,
  })

  res.json(user)
}

// LOGIN USER WITH JWT
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(401).json({ message: "Invalid login credentials!" })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(401).json({ message: "Invalid login credentials!" })
  }

  // Check if the JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "FATAL ERROR: JWT_SECRET is not defined in environment variables.",
    )
  }

  const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })

  res.json({ userToken })
}
