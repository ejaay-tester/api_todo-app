/**
 * USER SCHEMA OR MODEL
 * Defines the structure of user documents stored in MongoDB
 */

import mongoose, { mongo } from "mongoose"
import bcrypt from "bcryptjs"

// Define a User Interface (Better Practice)
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  timestamps: {
    createdAt: Date
    updatedAt: Date
  }
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
    },
  },
  {
    timestamps: true,
    // Industry Standard: Automatically remove password when converting to JSON
    toJSON: {
      transform: (_, ret) => {
        delete (ret as { password?: string }).password // Cast to allow deletion
        return ret
      },
    },
  },
)

// Hash password automatically before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare provided password with hashed password in the database
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Then, use <IUser> in the model definition
export default mongoose.model<IUser>("User", UserSchema)
