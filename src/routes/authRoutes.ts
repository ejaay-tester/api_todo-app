import express from "express"
import { registerUser, loginUser } from "../controllers/authController"
import { validateRequest } from "../middleware/validationRequest"
import { registerSchema, loginSchema } from "../schemas/authSchemas"

const router = express.Router()

/**
 * Register a new user
 */
router.post("/register", validateRequest(registerSchema), registerUser) // POST /api/register

/**
 * Login user and return JSON Web Token or JWT
 */
router.post("/login", validateRequest(loginSchema), loginUser) // POST /api/login

export default router
