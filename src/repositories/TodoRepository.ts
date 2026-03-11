import mongoose, { mongo } from "mongoose"
import Todo, { ITodo } from "../models/TodoSchema"
import { NotFoundError } from "../middleware/errorHandler"

export interface TodoFilter {
  completed?: boolean
  title?: { $regex: string; $options: "i" }
  userId?: mongoose.Types.ObjectId
}

export interface PaginationOptions {
  page: number
  limit: number
}

export class TodoRepository {
  /**
   * GET ALL TODOS WITH FILTERING AND PAGINATION
   */
  async findAllTodo(
    filter: TodoFilter,
    options: PaginationOptions,
  ): Promise<{ todos: ITodo[]; total: number }> {
    const skip = (options.page - 1) * options.limit

    const [todos, total] = await Promise.all([
      Todo.find(filter).limit(options.limit).skip(skip).sort({ createdAt: -1 }),
      Todo.countDocuments(filter),
    ])
    return { todos, total }
  }

  /**
   * FIND TODO BY ID
   */
  async findTodoById(id: string): Promise<ITodo | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError("Todo")
    }
    return Todo.findById(id)
  }

  /**
   * CREATE NEW TODO
   */
  async createTodo(data: Partial<ITodo>): Promise<ITodo> {
    return Todo.create(data)
  }

  /**
   * UPDATE TODO BY ID
   */
  async updateTodo(id: string, data: Partial<ITodo>): Promise<ITodo | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError("Todo")
    }

    const todo = await Todo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })

    if (!todo) {
      throw new NotFoundError("Todo")
    }
    return todo
  }

  /**
   * DELETE TODO BY ID
   */
  async deleteTodo(id: string): Promise<ITodo | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError("Todo")
    }

    const todo = await Todo.findByIdAndDelete(id)

    if (!todo) {
      throw new NotFoundError("Todo")
    }
    return todo
  }

  /**
   * GET TODOS BY USER ID
   */
  async findByUserId(
    userId: string,
    options: PaginationOptions,
  ): Promise<{ todos: ITodo[]; total: number }> {
    return this.findAllTodo(
      { userId: new mongoose.Types.ObjectId(userId) },
      options,
    )
  }
}
