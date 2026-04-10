import express from "express";
import { getLineSuggestions } from "../controllers/rewrite.controller.js";

const router = express.Router();

router.post("/suggestions", getLineSuggestions);

export default router;