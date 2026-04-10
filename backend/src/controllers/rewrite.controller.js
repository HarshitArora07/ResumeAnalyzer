import { generateLineSuggestions } from "../services/aiRewrite.service.js";

export const getLineSuggestions = async (req, res) => {
  try {

    if (!req.body) {
      return res.status(400).json({
        message: "Request body missing"
      });
    }

    const { text } = req.body;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        message: "Valid resume text (min 50 chars) is required"
      });
    }

    const suggestions = await generateLineSuggestions(text);

    return res.status(200).json({
      suggestions: suggestions || []
    });

  } catch (error) {
    console.error("Line suggestion error:", error);

    return res.status(500).json({
      message: "Failed to get suggestions"
    });
  }
};