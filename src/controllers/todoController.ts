// CONTROLLERS CONTAINS BUSINESS LOGIC
// ANSWERS "WHAT SHOULD HAPPEN WHEN API IS CALLED?"
// CONTROLLER RESPONSIBILITIES:
// 1. HANDLE REQUEST LOGIC
// 2. QUERY DATABASE
// 3. RETURN RESPONSE

import Todo from "../models/TodoSchema"
import { Request, Response, NextFunction } from "express"
import { TodoRepository } from "../repositories/TodoRepository"
import { ResponseHandler } from "../utils/response"
import {
  asyncHandler,
  NotFoundError,
  ValidationError,
} from "../middleware/errorHandler"

export class TodoController {
  private todoRepository: TodoRepository

  constructor() {
    this.todoRepository = new TodoRepository()
  }

  /**
   * FETCH ALL TODOS WITH PAGINATION AND FILTERING (GET)
   */

  getAllTodos = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      /**
       * PAGINATION LOGIC
       */

      // Convert query strings to numbers. Default to page 1 and limit 10.
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10

      // Calculate the skip value (e.g., Page 2 with limit 10, skips the first 10 items)
      const skip = (page - 1) * limit

      // Input validation
      if (page < 1 || limit < 1) {
        throw new ValidationError("Page and limit must be greater than 0")
      }

      /**
       * FILTERING LOGIC
       */

      // Define the filter object. 'any' allows us to add dynamic keys based on query.
      const filter: any = {}

      // Filter by completion status
      // Convert the string "true" / "false" from the URL into a Boolean
      if (req.query.completed !== undefined) {
        filter.completed = req.query.completed === "true"
      }

      /**
       * SEARCH LOGIC
       */
      // Sanitize search input
      // Search by title (case-insensitive)
      // If you pass ?title=work, it finds todos containing "work"
      if (req.query.title) {
        const sanitizedTitle = String(req.query.title).replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        )
        filter.title = { $regex: sanitizedTitle, $options: "i" }
      }

      // Add user filter if authenticated
      if ((req as any).user) {
        filter.userId = (req as any).user.id
      }

      const { todos, total } = await this.todoRepository.findAllTodo(filter, {
        page,
        limit,
      })

      console.log("Fetched Todo:", todos)
      // Response includes data + pagination metadata
      return ResponseHandler.paginated(
        res,
        todos,
        total,
        page,
        limit,
        todos.length === 0 ? "No todos found" : "Todos retrieved successfully",
      )
    },
  )

  /**
   * FETCH SINGLE TODO BY ID (GET)
   */
  getTodoById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const todo = await this.todoRepository.findTodoById(String(req.params.id))

      if (!todo) {
        throw new NotFoundError("Todo not found!")
      }

      console.log("Fetched Todo:", todo)

      return ResponseHandler.success(
        res,
        200,
        "Todo retrieved successfully",
        todo,
      )
    },
  )

  /**
   * CREATE NEW TODO (POST)
   */
  createTodo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { title } = req.body

      // Validation: Ensure title exists in body
      if (!title || !title.trim()) {
        throw new ValidationError("Title is required!")
      }

      const todo = await this.todoRepository.createTodo({
        ...req.body,
        userId: (req as any).user.id,
      })
      console.log("Created todo:", todo)

      return ResponseHandler.success(
        res,
        201,
        "Todo created successfully",
        todo,
      )
    },
  )

  /**
   * UPDATE TODO (PUT/PATCH)
   */
  updateTodo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Validate ownership
      const existingTodo = await this.todoRepository.findTodoById(
        String(req.params.id),
      )
      if (existingTodo?.userId.toString() !== (req as any).user.id) {
        throw new ValidationError("You can only update your own todos")
      }
      const todo = await this.todoRepository.updateTodo(
        String(req.params.id),
        req.body,
      )
      console.log("Updated Todo:", todo)

      return ResponseHandler.success(
        res,
        200,
        "Todo is successfully updated",
        todo,
      )
    },
  )

  /**
   * DELETE TODO (DELETE)
   */

  deleteTodo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Validate ownership
      const existingTodo = await this.todoRepository.findTodoById(
        String(req.params.id),
      )

      if (!existingTodo) {
        // If the todo doesn't exist, return 404 immediately
        // This helps your tests know they are trying to delete something already gone
        throw new NotFoundError("Todo not found!")
      }

      if (existingTodo?.userId.toString() !== (req as any).user.id) {
        throw new ValidationError("You can only delete your own todos")
      }

      // Capture the result of the delete
      const deletedTodo = await this.todoRepository.deleteTodo(
        String(req.params.id),
      )
      console.log(
        `Deleted Todo ID: ${String(req.params.id)} | Success: ${deletedTodo}`,
      )

      // Return 204 (No Content) - The industry-standard for deletes
      return res.status(204).send()
    },
  )
}
