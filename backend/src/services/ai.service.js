  // backend/src/services/ai.service.js

  import Groq from "groq-sdk";
  import { env } from "../config/env.js";

  const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
  });

  export const generateAIAnalysis = async (resumeText, jobDescription = null) => {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        messages: [
          {
            role: "system",
          content: `
  You are a senior ATS resume evaluator and career consultant.

  You MUST return ONLY valid JSON.

  Return analysis in this exact structure:

  {
    "overallScore": number,
    "executiveSummary": "2-3 concise but professional sentences (max 60 words)",
    "strengths": ["bullet 1", "bullet 2"],
    "weaknesses": ["bullet 1", "bullet 2"],
    "sectionAnalysis": {
      "contact": ["specific observations"],
      "summary": ["specific observations"],
      "experience": ["specific observations"],
      "skills": ["specific observations"],
      "formatting": ["specific observations"]
    },
    "improvementSuggestions": ["clear actionable improvements with examples"],

    "jobMatch": null OR {
      "overallMatchScore": number,
      "reliabilityLevel": "Low | Moderate | Strong",
      "matchedRequirements": [
        {
          "jdRequirement": "requirement from job description",
          "resumeEvidence": "exact evidence from resume",
          "resumeSection": "Contact | Summary | Experience | Skills | Projects",
          "matchStrength": "Weak | Moderate | Strong"
        }
      ],
      "missingRequirements": ["requirement clearly missing from resume"],
      "alignmentSummary": "2-3 sentence hiring-style evaluation"
    }
  }

  Rules:
  - Each bullet must be specific and at least 12 words.
  - Do NOT give generic feedback.
  - Analyze content depth, impact, clarity, metrics usage.
  - Be critical but constructive.
  - Only include jobMatch object if job description is provided. Otherwise return null.
  - Matching must be semantic, not just keyword repetition.
  - Resume evidence must be directly extracted from resume.
  - Do NOT fabricate achievements.
  - reliabilityLevel logic:
      > 80 = Strong
      60-80 = Moderate
      < 60 = Low
  - No markdown.
  - No explanation outside JSON.
  `
          },
          {
            role: "user",
            content: `
  RESUME:
  ${resumeText}

  ${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ""}

  If job description exists, perform semantic comparison and populate jobMatch.
  `
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;

      return JSON.parse(content);

    } catch (error) {
      console.error("AI analysis failed:", error);
      throw new Error("AI resume analysis failed");
    }
  };