import express from "express";
import { analyzeResume } from "../controllers/analysis.controller.js";

const router = express.Router();

router.post("/", analyzeResume);

export default router;