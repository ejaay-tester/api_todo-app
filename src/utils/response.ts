import { Response } from "express"

// Standardized API response format
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  meta?: {
    count?: number
    totalItems?: number
    totalPages?: number
    currentPage?: number
  }
  error?: any // Include error details if needed
}

export class ResponseHandler {
  // Standard success response
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    meta?: any,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    })
  }

  // Standard error response
  static error(
    res: Response,
    statusCode: number,
    message: string,
    error?: any,
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error : {}, // Include error details in development for debugging
    })
  }

  // List response with pagination
  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = "Data retrieved successfully",
  ): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        count: data.length,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    })
  }
}
