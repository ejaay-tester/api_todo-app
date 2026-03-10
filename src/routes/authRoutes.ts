import express from "express"
import { registerUser, loginUser } from "../controllers/authController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

/**
 * Register a new user
 */
router.post("/register", registerUser) // POST /api/register

/**
 * Login user and return JSON Web Token or JWT
 */
router.post("/login", loginUser) // POST /api/login

export default router
