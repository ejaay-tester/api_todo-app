// ROUTES DEFINES THE API ENDPOINT
// ANSWERS "WHAT ENDPOINT EXISTS?"

import express from "express"
import { TodoController } from "../controllers/todoController"
import { authMiddleware } from "../middleware/authMiddleware"
import { todo } from "node:test"

const router = express.Router()
const todoController = new TodoController()

// Protect all todo routes with authentication middleware
router.use(authMiddleware)

router.get("/todos", todoController.getAllTodos.bind(todoController)) // GET /api/todos
router.get("/todos/:id", todoController.getTodoById.bind(todoController)) // GET /api/todos/:id
router.post("/todos", todoController.createTodo.bind(todoController)) // POST /api/todos
router.put("/todos/:id", todoController.updateTodo.bind(todoController)) // PUT /api/todos/:id
router.delete("/todos/:id", todoController.deleteTodo.bind(todoController)) // DELETE /api/todos:id

export default router
