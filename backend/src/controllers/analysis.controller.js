export const analyzeResume = async (req, res) => {
  try {
    const { text } = req.body;

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
      "javascript",
      "react",
      "node",
      "mongodb",
      "express",
      "python",
      "sql",
      "html",
      "css",
      "typescript",
      "aws",
      "docker",
      "git"
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
    // 8️⃣ Measurable Achievements Check
    // ===============================
    const hasNumbers = /\d+%|\d+\+|\$\d+|\d+ years|\d+ projects/i.test(text);

    // ===============================
    // 9️⃣ Action Verbs Check
    // ===============================
    const actionVerbs = [
      "developed",
      "built",
      "created",
      "implemented",
      "designed",
      "led",
      "managed",
      "optimized",
      "improved",
      "engineered",
      "delivered"
    ];

    let actionVerbMatches = 0;
    actionVerbs.forEach(verb => {
      if (lowerText.includes(verb)) {
        actionVerbMatches++;
      }
    });

    let impactScore = 0;
    if (hasNumbers) impactScore += 10;
    if (actionVerbMatches >= 3) impactScore += 10;

    // ===============================
    // 🎯 Final Score Calculation
    // ===============================
    let finalScore = Math.min(
      Math.round(
        keywordScore +
        structureScore +
        contactScore +
        lengthScore +
        impactScore
      ),
      100
    );

    // ===============================
    // 📝 Feedback Generator
    // ===============================
    let feedback = "";

    if (!hasExperience)
      feedback += "Add an Experience section.\n";

    if (!hasEducation)
      feedback += "Add an Education section.\n";

    if (!hasSkills)
      feedback += "Add a Skills section.\n";

    if (!hasEmail)
      feedback += "Add a professional email address.\n";

    if (!hasPhone)
      feedback += "Add a contact phone number.\n";

    if (keywordMatches < 5)
      feedback += "Include more relevant technical keywords.\n";

    if (!hasNumbers)
      feedback += "Add measurable achievements (%, numbers, impact).\n";

    if (actionVerbMatches < 3)
      feedback += "Use strong action verbs like Developed, Built, Implemented.\n";

    if (wordCount < 200)
      feedback += "Resume is too short. Add more detailed content.\n";

    if (wordCount > 1000)
      feedback += "Resume may be too long. Keep it concise (1–2 pages).\n";

    if (feedback === "") {
      feedback =
        "Excellent resume! Strong structure, keywords, and impact statements. Minor refinements can further optimize ATS performance.";
    }

    return res.status(200).json({
      score: finalScore,
      feedback,
      improvedText: null
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};