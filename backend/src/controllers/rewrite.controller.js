import { generateRewrite } from "../services/aiRewrite.service.js";

export const rewriteResume = async (req, res) => {
  try {
    const { text, jobDescription } = req.body;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        message: "Valid resume text is required",
      });
    }

    const hasValidJD =
      jobDescription && jobDescription.trim().length > 50;

    const improvedResume = await generateRewrite(
      text,
      hasValidJD ? jobDescription : null
    );

    return res.status(200).json({
      improvedResume,
    });

  } catch (error) {
    console.error("Rewrite Error:", error);
    return res.status(500).json({
      message: "Resume rewrite failed",
    });
  }
};