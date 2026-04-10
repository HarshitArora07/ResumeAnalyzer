// backend/src/controllers/resume.controller.js

import { parseResume } from "../services/resumeParser.service.js";
//  import { generateAIAnalysis } from "../services/ai.service.js";

export const uploadResume = async (req, res) => {
  try {
    // ===============================
    // 1️⃣ Check File Upload
    // ===============================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // ===============================
    // 2️⃣ Parse Resume Text
    // ===============================
    let extractedText;

    try {
      extractedText = await parseResume(req.file.path);

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Resume content is empty or unreadable.",
        });
      }
    } catch (parseError) {
      console.error("Resume parsing failed:", parseError);
      return res.status(500).json({
        success: false,
        error: "Failed to parse resume file.",
      });
    }

    // ===============================
    // 3️⃣ Generate AI Analysis (Already Returns JSON)
    // ===============================
    // let aiResult;

    // try {
    //   aiResult = await generateAIAnalysis(extractedText);
    // } catch (aiError) {
    //   console.error("AI analysis failed:", aiError);
    //   return res.status(500).json({
    //     success: false,
    //     error: "AI analysis failed.",
    //   });
    // }

    // ===============================
    // 4️⃣ Final Response
    // ===============================
    return res.status(200).json({
  success: true,
  extractedText,
});

  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while processing resume.",
    });
  }
};