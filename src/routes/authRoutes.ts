import express from "express"
import { AuthController } from "../controllers/authController"
import { validateRequest } from "../middleware/validationRequest"
import { loginSchema, registerSchema } from "../schemas/authSchemas"

const router = express.Router()
const authController = new AuthController()

/**
 * BIND METHODS TO PRESERVE 'this' CONTEXT
 * - This ensures that when the controller methods are called, they have access to the correct 'this' context, which is important for accessing class properties and methods.
 */

// POST /api/register
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser.bind(authController),
)

// POST /api/login
router.post(
  "/login",
  validateRequest(loginSchema),
  authController.loginUser.bind(authController),
)

export default router
