/**
 * Import Express types to define what req, res, and next are
 * Import the JWT library to handle token verification
 */
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

/**
 * Created a "CustomRequest" because the default Express Request
 * doesn't have a "user" property. This tells the TS it's okay to add it
 */
interface CustomRequest extends Request {
  user?: any
}

// The middleware function: it sits between the Request and the Final Route
export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  // 1. Look for the 'Authorization' header (usually looks like: "Bearer <token>")
  const authHeader = req.headers.authorization

  // 2. If the header is missing, stop here and returns a 401 (Unauthorized) error
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided!" })
  }

  // 3. The header is "Bearer [token]", .split(" ")[1] grabs just the [token] part
  const token = authHeader.split(" ")[1]

  // 4. Safety check: If the split fails or the token is empty, stop the request.
  if (!token) {
    return res.status(401).json({ message: "Malformed token!" })
  }

  // 5. Get the secret key from the .env file
  const secret = process.env.JWT_SECRET

  // 6. Security/Safety: If you forgot to set your secret in .env,
  // crash the server immediately so you don't run an insecure app.
  if (!secret) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined!")
  }

  try {
    // 7. Verification: jwt.verify checks if the token is real and not expired.
    // It uses the 'secret' to decrypt/validate the signature.
    const decoded = jwt.verify(token, secret)

    // 8. Success! Store the user data (id or email) inside the 'req' object.
    // This makes the user's info available to the next function/controller.
    req.user = decoded

    // 9. Everything is good. Move to the next function in the route
    next()
  } catch (error) {
    // 10. If jwt.verify fails (token expired, tempered with, or wrong secret),
    // catch the error and tell the user they aren't allowed in.
    return res.status(401).json({ message: "Invalid token" })
  }
}
