import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import resumeRoutes from "./routes/resume.routes.js"
import analysisRoutes from "./routes/analysis.routes.js"
import { errorHandler } from "./middleware/error.middleware.js"
import rewriteRoutes from "./routes/rewrite.routes.js";

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/api/analysis", analysisRoutes)
app.use("/api/rewrite", rewriteRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Resume Analyzer API Running" })
})

app.use(errorHandler)

export default app