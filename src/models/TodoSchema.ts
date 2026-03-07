// MODELS DEFINE DATABASE SCHEMA

import mongoose from "mongoose"

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

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Todo", TodoSchema)
