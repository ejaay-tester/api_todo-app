import { Request, Response, NextFunction } from "express"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true, // Indicates if the error is expected (operational) or a programming error
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message)
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource") {
    super(404, `${resource} not found!`)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message)
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super(500, message)
  }
}

// Global Error Handler Middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === "development" ? err.stack : {}, // Include stack trace in development for debugging
    })
  }

  // Handle Mongoose validation errors (if using Mongoose for MongoDB)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: err.message,
    })
  }

  // Handle Mongoose cast errors (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: err.message,
    })
  }

  // Fallback for unhandled errors (programming errors or unexpected issues)
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {}, // Include stack trace in development for debugging
  })
}

// Async wrapper to catch errors in async route handlers and pass them to the error handler
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
