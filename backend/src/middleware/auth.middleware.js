import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import User from "../models/user.model.js"

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Not authorized" })

    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
}