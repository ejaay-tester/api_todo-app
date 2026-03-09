// CONTROLLERS CONTAINS BUSINESS LOGIC
// ANSWERS "WHAT SHOULD HAPPEN WHEN API IS CALLED?"
// CONTROLLER RESPONSIBILITIES:
// 1. HANDLE REQUEST LOGIC
// 2. QUERY DATABASE
// 3. RETURN RESPONSE

import Todo from "../models/TodoSchema"
import { Request, Response } from "express"

// GET ALL TODOS (with Pagination, Filtering, and Search)
export const getTodos = async (req: Request, res: Response) => {
  try {
    /**
     * PAGINATION LOGIC
     */

    // 1. Convert query strings to numbers. Default to page 1 and limit 10.
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    // 2. Calculate the skip value (e.g., Page 2 with limit 10, skips the first 10 items)
    const skip = (page - 1) * limit

    /**
     * FILTERING LOGIC
     */

    // 3. Define the filter object. 'any' allows us to add dynamic keys based on query.
    const filter: any = {}

    // 4. Filtering logic:
    // Filter by completion status
    // Convert the string "true" / "false" from the URL into a Boolean
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true"
    }

    // 5. Search logic:
    // Search by title (case-insensitive)
    // If you pass ?title=work, it finds todos containing "work"
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" }
    }

    // 6. Database Operations
    // Parallel execution for performance
    const [todos, total] = await Promise.all([
      Todo.find(filter)
        .limit(limit) // Limits the number of results returned
        .skip(skip) // Skips the items from the previous pages
        .sort({ createdAt: -1 }), // Shows newest items first
      Todo.countDocuments(filter), // Counts total items matching the filter
    ])

    // 7. Response includes data + pagination metadata
    res.status(200).json({
      success: true,
      count: todos.length,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: todos, // If list is todo list is empty, data will naturally be []
      message:
        todos.length === 0
          ? "No todos added on the list!"
          : "Todos retrieved successfully!",
    })
  } catch (error) {
    res.status(500).json({ message: "Server Error", error })
  }
}

// GET SINGLE TODO
export const getTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!" })
    }

    res.status(200).json({ success: true, data: todo })
  } catch (error) {
    // Catching malformed MongoDB IDs
    res.status(400).json({ message: "Invalid ID format" })
  }
}

// POST NEW TODO
export const createTodo = async (req: Request, res: Response) => {
  try {
    // Validation: Ensure title exists in body
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required!" })
    }

    const todo = await Todo.create(req.body)
    res.status(201).json({ success: true, data: todo })
  } catch (error) {
    res.status(400).json({ message: "Failed to create todo", error })
  }
}

// UPDATE TODO
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure updates follow Schema rules
    })

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!" })
    }

    res.status(200).json({ success: true, data: todo })
  } catch (error) {
    res.status(400).json({ message: "Update failed", error })
  }
}

// DELETE TODO
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!" })
    }

    // Status 200 with a message is often better for SPAs than 204 No Content
    res
      .status(200)
      .json({ status: true, message: "Todo deleted successfully!" })
  } catch (error) {
    res.status(400).json({ message: "Delete failed" })
  }
}
