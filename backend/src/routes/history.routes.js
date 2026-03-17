import express from "express"
import History from "../models/history.model.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })

    res.json(history)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router