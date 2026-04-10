import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const generateLineSuggestions = async (resumeText) => {
  try {
    // ✅ Step 1: Split resume into lines
    const lines = resumeText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // ✅ Step 2: Process each line separately
    const results = await Promise.all(
      lines.map(async (line) => {
        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                temperature: 0.5,
                messages: [
                  {
                    role: "system",
                    content: `
You are an expert resume writer.

Rewrite the given resume line to be:
- More professional
- ATS optimized
- Action-oriented

Keep it concise.

Return ONLY the improved sentence.
Do NOT add explanations.
                    `,
                  },
                  {
                    role: "user",
                    content: line,
                  },
                ],
              }),
            }
          );

          const data = await response.json();

          const suggestion =
            data?.choices?.[0]?.message?.content?.trim() || line;

          return {
            original: line,
            suggestion,
          };
        } catch (err) {
          console.error("Line failed:", line);
          return {
            original: line,
            suggestion: line,
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return [];
  }
};