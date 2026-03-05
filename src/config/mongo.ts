// Purpose
// Connect Express API to MongoDB

import mongoose from "mongoose"

export const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.error("MONGO_URI is missing!")
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log("MongoDB Connected!")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}
