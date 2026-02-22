import OpenAI from "openai";
import { env } from "../config/env.js";

let openai = null;

// Initialize OpenAI only if API key exists
if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== "dummy") {
  openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
} else {
  console.log("OpenAI API key not set. AI analysis will return placeholder text.");
}

/**
 * Generate AI resume analysis
 * @param {string} text - Resume text to analyze
 * @returns {string} AI analysis or placeholder
 */
export const generateAIAnalysis = async (text) => {
  if (!openai) {
    // Return a placeholder message while testing
    return "AI service is not enabled right now. Replace the API key to get real analysis.";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional resume reviewer." },
      { role: "user", content: `Analyze this resume and give improvements:\n${text}` }
    ]
  });

  return response.choices[0].message.content;
};