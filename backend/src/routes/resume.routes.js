// backend/src/routes/resume.routes.js
import express from "express";
// Named import must match the export
import { upload } from "../middleware/upload.middleware.js"; 
import { uploadResume } from "../controllers/resume.controller.js";

const router = express.Router();

// Remove protect for now
router.post("/upload", upload.single("resume"), uploadResume);

export default router;