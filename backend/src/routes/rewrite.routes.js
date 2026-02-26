import express from "express";
import { rewriteResume } from "../controllers/rewrite.controller.js";

const router = express.Router();

router.post("/", rewriteResume);

export default router;