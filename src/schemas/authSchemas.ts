import { z } from "zod"

// Validation schema for user registration
// export const registerSchema = z.object({
//   email: z.email({ message: "Invalid email format" }),
//   password: z
//     .string({ message: "Password is required" })
//     .min(8, { message: "Password must be at least 8 characters long" })
//     // Note: Use one combined regex for better performance and readability
//     .regex(
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
//       "Password must contain a letter, a number, and a special character",
//     ),
// })

export const registerSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Invalid email format" })),
  password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    // Note: Use one combined regex for better performance and readability
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*_.)])\S{8,}$/,
      "Password must contain a letter, a number, and a special character, and not contain spaces",
    ),
})
// Validation schema for user login
export const loginSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }),
})

// Type inference for TypeScript (useful for controllers to type the request body)
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
