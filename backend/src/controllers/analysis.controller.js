import { generateAIAnalysis } from "../services/ai.service.js";


export const analyzeResume = async (req, res) => {
  try {
    const { text, jobDescription } = req.body;

    if (!text) {
      return res.status(400).json({ message: "No resume text provided" });
    }

    const lowerText = text.toLowerCase();

    // ===============================
    // 1️⃣ Word Count
    // ===============================
    const wordCount = text.split(/\s+/).length;

    // ===============================
    // 2️⃣ Contact Info Check
    // ===============================
    const hasEmail = /\S+@\S+\.\S+/.test(text);
    const hasPhone = /\b\d{10}\b/.test(text);

    // ===============================
    // 3️⃣ Section Checks
    // ===============================
    const hasExperience = lowerText.includes("experience");
    const hasEducation = lowerText.includes("education");
    const hasSkills = lowerText.includes("skills");

    // ===============================
    // 4️⃣ Keyword Matching
    // ===============================
    const keywords = [
      "javascript","react","node","mongodb","express",
      "python","sql","html","css","typescript",
      "aws","docker","git"
    ];

    let keywordMatches = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        keywordMatches++;
      }
    });

    const keywordScore = (keywordMatches / keywords.length) * 30;

    // ===============================
    // 5️⃣ Structure Score
    // ===============================
    let structureScore = 0;
    if (hasExperience) structureScore += 10;
    if (hasEducation) structureScore += 10;
    if (hasSkills) structureScore += 10;

    // ===============================
    // 6️⃣ Contact Score
    // ===============================
    let contactScore = 0;
    if (hasEmail) contactScore += 10;
    if (hasPhone) contactScore += 10;

    // ===============================
    // 7️⃣ Length Score
    // ===============================
    let lengthScore = 0;
    if (wordCount > 300 && wordCount < 900) {
      lengthScore = 20;
    } else if (wordCount >= 200) {
      lengthScore = 10;
    }

    // ===============================
    // 8️⃣ Measurable Achievements
    // ===============================
    const hasNumbers = /\d+%|\d+\+|\$\d+|\d+ years|\d+ projects/i.test(text);

    // ===============================
    // 9️⃣ Action Verbs
    // ===============================
    const actionVerbs = [
      "developed","built","created","implemented","designed",
      "led","managed","optimized","improved","engineered","delivered"
    ];

    let actionVerbMatches = 0;
    actionVerbs.forEach(verb => {
      if (lowerText.includes(verb)) {
        actionVerbMatches++;
      }
    });

    let impactScore = 0;
    if (hasNumbers) impactScore += 10;
    impactScore += Math.min(actionVerbMatches * 3, 10);

    // ===============================
    // 🎯 Final ATS Score
    // ===============================
    // Normalize each category to 100 scale
const normalizedKeyword = (keywordMatches / keywords.length) * 100;
const normalizedStructure = structureScore / 30 * 100;
const normalizedContact = contactScore / 20 * 100;
const normalizedLength = lengthScore / 20 * 100;
const normalizedImpact = impactScore / 20 * 100;

// Apply weights
let finalScore = Math.round(
  normalizedKeyword * 0.30 +     // 30%
  normalizedStructure * 0.20 +   // 20%
  normalizedContact * 0.10 +     // 10%
  normalizedLength * 0.20 +      // 20%
  normalizedImpact * 0.20        // 20%
);

   /////////////////////////////
// SMART GRADUAL BREAKDOWN
/////////////////////////////

// CONTACT (density-based)
let contactSectionScore = 0;

if (hasEmail) contactSectionScore += 40;
if (hasPhone) contactSectionScore += 30;

const hasLinkedIn = lowerText.includes("linkedin");
if (hasLinkedIn) contactSectionScore += 20;

// Penalize if too many random numbers (looks messy)
const rawNumbers = text.match(/\d+/g);
if (rawNumbers && rawNumbers.length > 20) {
  contactSectionScore -= 10;
}

contactSectionScore = Math.min(contactSectionScore, 100);


// SUMMARY (quality-based, not wordCount based)
let summarySectionScore = 0;

const summaryMatch = text.match(/summary|profile/i);
if (summaryMatch) {
  summarySectionScore += 30;

  const summaryLength = text.substring(0, 500).split(/\s+/).length;

  if (summaryLength > 40) summarySectionScore += 20;
  if (summaryLength > 70) summarySectionScore += 20;

  summarySectionScore += Math.min(actionVerbMatches * 5, 20);
}

summarySectionScore = Math.min(summarySectionScore, 100);


// EXPERIENCE (weighted)
let experienceSectionScore = 0;

if (hasExperience) experienceSectionScore += 30;

experienceSectionScore += Math.min(actionVerbMatches * 6, 30);

if (rawNumbers) {
  experienceSectionScore += Math.min(rawNumbers.length * 4, 40);
}

experienceSectionScore = Math.min(experienceSectionScore, 100);


// SKILLS (relevance-based)
let skillsSectionScore = 0;

if (hasSkills) skillsSectionScore += 30;

skillsSectionScore += Math.min(keywordMatches * 6, 50);

// penalize if keyword stuffing
if (keywordMatches > 15) {
  skillsSectionScore -= 10;
}

skillsSectionScore = Math.max(0, Math.min(skillsSectionScore, 100));


// ACTION VERBS (ratio-based)
let actionVerbScore = 0;

const totalWords = wordCount;
const verbRatio = actionVerbMatches / totalWords;

actionVerbScore = Math.min(verbRatio * 1000, 100);


// QUANTIFICATION (density-based)
let quantificationScore = 0;

if (rawNumbers) {
  const quantRatio = rawNumbers.length / totalWords;
  quantificationScore = Math.min(quantRatio * 2000, 100);
}

contactSectionScore = Math.round(contactSectionScore);
summarySectionScore = Math.round(summarySectionScore);
experienceSectionScore = Math.round(experienceSectionScore);
skillsSectionScore = Math.round(skillsSectionScore);
actionVerbScore = Math.round(actionVerbScore);
quantificationScore = Math.round(quantificationScore);
    // ===============================
    // 📝 Feedback
    // ===============================
    let feedback = "";

    if (!hasExperience) feedback += "Add an Experience section.\n";
    if (!hasEducation) feedback += "Add an Education section.\n";
    if (!hasSkills) feedback += "Add a Skills section.\n";
    if (!hasEmail) feedback += "Add a professional email address.\n";
    if (!hasPhone) feedback += "Add a contact phone number.\n";
    if (keywordMatches < 5) feedback += "Include more relevant technical keywords.\n";
    if (!hasNumbers) feedback += "Add measurable achievements (%, numbers, impact).\n";
    if (actionVerbMatches < 3) feedback += "Use strong action verbs like Developed, Built, Implemented.\n";
    if (wordCount < 200) feedback += "Resume is too short. Add more detailed content.\n";
    if (wordCount > 1000) feedback += "Resume may be too long. Keep it concise (1–2 pages).\n";

    if (feedback === "") {
      feedback =
        "Excellent resume! Strong structure, keywords, and impact statements.";
    }

    // ===============================
    // 🎯 JOB MATCHING
    // ===============================
    let jobMatchScore = null;
    let missingKeywords = [];

    if (jobDescription && jobDescription.trim() !== "") {
      const jdText = jobDescription.toLowerCase();

      const jdWords = jdText
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 4);

      const uniqueJDWords = [...new Set(jdWords)];

      if (uniqueJDWords.length > 0) {
        let matchCount = 0;

        uniqueJDWords.forEach(word => {
          if (lowerText.includes(word)) {
            matchCount++;
          } else {
            missingKeywords.push(word);
          }
        });

        jobMatchScore = Math.round(
          (matchCount / uniqueJDWords.length) * 100
        );
      }
    }
    // ===============================
// 🤖 AI ANALYSIS (Always runs)
// ===============================
// 🤖 AI ANALYSIS (Only run when JD exists)
let aiAnalysis = null;

try {
  const hasValidJD =
    jobDescription && jobDescription.trim().length > 50;

  // Always run AI
  aiAnalysis = await generateAIAnalysis(
    text,
    hasValidJD ? jobDescription : null
  );

  // HARD ENFORCE: Remove jobMatch if JD not valid
  if (!hasValidJD && aiAnalysis) {
    aiAnalysis.jobMatch = null;
  }

} catch (error) {
  console.error("AI generation failed:", error);
}

    return res.status(200).json({
  score: finalScore,
  sectionScores: {
    contact: contactSectionScore || 0,
    summary: summarySectionScore || 0,
    experience: experienceSectionScore || 0,
    skills: skillsSectionScore || 0,
    actionVerbs: actionVerbScore || 0,
    quantification: quantificationScore || 0
  },
  feedback,
  aiAnalysis
});

  } catch (error) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};