// backend/src/controllers/resume.controller.js
import { parseResume } from "../services/resumeParser.service.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);
    console.log("File path:", req.file.path);

    // Parse the uploaded file
    let text;
    try {
      text = await parseResume(req.file.path);
      console.log("Parsed text length:", text.length);
    } catch (err) {
      console.error("Parsing failed:", err);
      return res.status(500).json({ error: "Failed to parse resume: " + err.message });
    }

    // Return dummy analysis for frontend testing
    res.status(201).json({
      _id: "dummy_id",
      extractedText: text,
      feedback: "AI feedback placeholder",
      improvedText: text, // same text for now
      score: 75, // dummy score
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    res.status(500).json({ error: error.message });
  }
};