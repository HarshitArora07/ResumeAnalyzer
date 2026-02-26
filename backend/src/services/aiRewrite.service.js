import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export const generateRewrite = async (resumeText, jobDescription = null) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are a senior executive resume writer and ATS optimization specialist.

Rewrite the resume to be:
- Clear
- Professional
- Impact-driven
- ATS optimized
- Concise
- Realistic (NO fake achievements)

Rules:
- Do NOT fabricate metrics or experience.
- Improve wording and clarity.
- Strengthen impact.
- Use strong action verbs.
- Keep formatting clean.
- Return ONLY the rewritten resume text.
`
        },
        {
          role: "user",
          content: `
RESUME:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ""}

If job description exists:
- Align resume naturally to job requirements.
- Improve keyword alignment without stuffing.
`
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("AI Rewrite failed:", error);
    throw new Error("AI rewrite failed");
  }
};