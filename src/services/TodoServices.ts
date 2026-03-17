import { TodoRepository } from "../repositories/TodoRepository"
import { ITodo } from "../models/TodoSchema"
import mongoose from "mongoose"

export class TodoService {
  // Instance of the repository to handle direct database operations
  private todoRepository: TodoRepository

  constructor() {
    // Initialize the repository when the service is created
    this.todoRepository = new TodoRepository()
  }

  /**
   * Fetches a paginated list of todos for a specific user
   * with optional search filters.
   */

  async getUserTodos(
    userId: string, // The raw string ID of the user
    filters: {
      completed?: boolean
      title?: string
      priority?: "low" | "medium" | "high"
    },
    pagination: { page: number; limit: number }, // Object containing page number and items per page
  ) {
    // Initialize the query object by converting the string userId to a Mongoose ObjectId
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) }

    // If a completion status is provided, add it to the database query
    if (filters.completed !== undefined) {
      filter.completed = filters.completed
    }

    // If a title is provided, use a Regex to allow partial, case-insensitive matching
    if (filters.title) {
      filter.title = { $regex: filters.title, $options: "i" }
    }

    // If a priority level is provided, filter specifically for that level
    if (filters.priority) {
      filter.priority = filters.priority
    }

    // Execute the query via the repository with the built filter and pagination settings
    return this.todoRepository.findAllTodo(filter, pagination)
  }

  /**
   * Standardizes the creation of a new todo item with default values
   */
  async createTodo(
    userId: string,
    data: {
      title: string
      description?: string
      priority?: "low" | "medium" | "high"
    },
  ) {
    // Merge the user's input with required system fields (ObjectId and default status)
    return this.todoRepository.createTodo({
      ...data, // Spread title, description, and priority from the request
      userId: new mongoose.Types.ObjectId(userId), // Link the todo to the correct user
      completed: false, // New todos always start as incomplete
    })
  }

  /**
   * Calculates and returns productivity metrics for a specific user
   */
  async getUserStats(userId: string) {
    // Convert string ID once to reuse in multiple repository calls
    const userIdObj = new mongoose.Types.ObjectId(userId)
    const filter = { userId: userIdObj }

    // Run three database counts simultaneously to improve performance
    const [todos, completed, pending] = await Promise.all([
      /**
       * Total todos count (including the completed and pending todos)
       */
      this.todoRepository.findAllTodo(filter, { page: 1, limit: 1000 }),

      /**
       * Completed todos count
       */
      this.todoRepository.findAllTodo(
        { ...filter, completed: true },
        { page: 1, limit: 1000 },
      ),

      /**
       * Pending todos count
       */
      this.todoRepository.findAllTodo(
        { ...filter, completed: false },
        { page: 1, limit: 1000 },
      ),
    ])

    // Construct a statistics object for the frontend
    return {
      totalTodos: todos.total,
      completedTodos: completed.total,
      pendingTodos: pending.total,

      /**
       * Calculate the completion rate percentage
       * Defaults to zero (0) if the user has no todos/tasks
       * to avoid division by zero
       */
      completionRate:
        todos.total > 0
          ? ((completed.total / todos.total) * 100).toFixed(2)
          : 0,
    }
  }
}
