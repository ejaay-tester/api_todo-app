/**
 * REGISTER USER
 * STORE PASSWORD SAFELY
 * NEVER STORE RAW PASSWORD
 */

import User from "../models/UserSchema"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    password: hashedPassword,
  })

  res.json(user)
}
