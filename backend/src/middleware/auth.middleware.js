import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import User from "../models/user.model.js"

export const protect = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const decoded = jwt.verify(token, env.JWT_SECRET)

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()

  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}