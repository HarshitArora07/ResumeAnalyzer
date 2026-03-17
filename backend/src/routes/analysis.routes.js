import express from "express";
import { analyzeResume } from "../controllers/analysis.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // ✅ ADD THIS

const router = express.Router();

// ✅ PROTECT THIS ROUTE
router.post("/", protect, analyzeResume);

export default router;