/**
 * TODO SCHEMA OR MODEL
 * Defines the structure of todo collections stored in MongoDB
 */

import mongoose from "mongoose"

export interface ITodo extends mongoose.Document {
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  userId: mongoose.Types.ObjectId
  timestamps: {
    createdAt: Date
    updatedAt: Date
  }
}

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
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
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
)

export default mongoose.model<ITodo>("Todo", TodoSchema)
