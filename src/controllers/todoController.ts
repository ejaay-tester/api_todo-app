import Todo from "../models/TodoSchema"
import { Request, Response } from "express"

// GET ALL TODO
export const getTodos = async (req: Request, res: Response) => {
  const todos = await Todo.find()

  res.json(todos)
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
