import Todo from "../models/TodoSchema"
import { Request, Response } from "express"

// GET ALL TODO
export const getTodos = async (req: Request, res: Response) => {
  const todos = await Todo.find()

  // Added better response if no todos on the list
  if (todos.length === 0) {
    return res.status(200).json({
      message: "No todos added on the list!",
      data: [],
    })
  }

  res.json({
    count: todos.length,
    data: todos,
  })
}

// GET SINGLE TODO
export const getTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!" })
    }

    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ message: "Invalid ID format or Server Error" })
  }
}

// POST NEW TODO
export const createTodo = async (req: Request, res: Response) => {
  const todo = new Todo(req.body)

  await todo.save()

  res.status(201).json(todo)
}

// UPDATE TODO
export const updateTodo = async (req: Request, res: Response) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.json(todo)
}

// DELETE TODO
export const deleteTodo = async (req: Request, res: Response) => {
  await Todo.findByIdAndDelete(req.params.id)

  res.status(204).send()
}
