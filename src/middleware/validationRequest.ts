import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod"

// Middleware to validate incoming request data
export const validateRequest = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the provided schema
      schema.parse(req.body)
      next() // If validation passes, proceed to the next middleware/controller
    } catch (error: any) {
      // If validation fails, send a 400 Bad Request response with error details
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors, // Zod provides detailed error information
      })
    }
  }
}
