import express from "express"
import passport from "passport"
import { register, login } from "../controllers/auth.controller.js"
import { generateToken } from "../controllers/auth.controller.js"
import { env } from "../config/env.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

// GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT for user
    const token = generateToken(req.user._id)
    // Redirect to frontend with token
    res.redirect(
  `${env.CLIENT_URL}/google-success?token=${token}&name=${req.user.name}&email=${req.user.email}`
)
  }
)

export default router