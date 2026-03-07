// ROUTES DEFINES THE API ENDPOINT
// ANSWERS "WHAT ENDPOINT EXISTS?"

import express from "express"
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo,
} from "../controllers/todoController"

const router = express.Router()

router.get("/todos", getTodos) // GET /api/todos
router.get("/todos/:id", getTodo) // GET /api/todos/:id
router.post("/todos", createTodo) // POST /api/todos
router.put("/todos/:id", updateTodo) // PUT /api/todos/:id
router.delete("/todos/:id", deleteTodo) // DELETE /api/todos:id

export default router
