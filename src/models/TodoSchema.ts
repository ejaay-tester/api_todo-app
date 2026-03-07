// TODO MODEL OR SCHEMA

import mongoose from "mongoose"
import { ref } from "node:process"

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  description: {
    type: String,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Todo", TodoSchema)
