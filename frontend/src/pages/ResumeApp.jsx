import { useState, useRef, useEffect } from "react"
import { Upload, LogOut, FileText } from "lucide-react"

function ResumeApp() {
  const [file, setFile] = useState(null)
  const [score, setScore] = useState(0)
  const [targetScore, setTargetScore] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [improvedText, setImprovedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  // ✅ NEW STATES (Layer 2)
  const [jobDescription, setJobDescription] = useState("")
  const [jobMatchScore, setJobMatchScore] = useState(null)
  const [missingKeywords, setMissingKeywords] = useState([])
  const [sectionScores, setSectionScores] = useState(null) // NEW: Section breakdown
  const [analysisResult, setAnalysisResult] = useState(null)

  const fileInputRef = useRef(null)

  const loadingMessages = [
    "Uploading resume...",
    "Extracting resume content...",
    "Calculating ATS score...",
    "Generating AI feedback..."
  ]

  const token = localStorage.getItem("token")

  const handleFile = (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    
  }

  const analyzeResume = async (selectedFile) => {
    try {
      setLoading(true)
      setScore(0)
      setTargetScore(0)
      setFeedback("")
      setImprovedText("")
      setShowConfetti(false)
      setJobMatchScore(null)
      setMissingKeywords([])
      setSectionScores(null) // reset section scores

      let stepIndex = 0

      const stepInterval = setInterval(() => {
        setLoadingStep(loadingMessages[stepIndex])
        stepIndex++
        if (stepIndex === loadingMessages.length) {
          clearInterval(stepInterval)
        }
      }, 1000)
      
      // 1️⃣ Upload Resume
      const formData = new FormData()
      formData.append("resume", selectedFile)

      const uploadRes = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          body: formData
        }
      )

      if (!uploadRes.ok) {
        throw new Error("Resume upload failed")
      }

      const resumeData = await uploadRes.json()

      // 2️⃣ Analyze Resume (Layer 1 + Layer 2 Optional)
const analysisRes = await fetch("http://localhost:5000/api/analysis", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: resumeData.extractedText,
    jobDescription: jobDescription.trim() !== "" ? jobDescription : null
  })
})

if (!analysisRes.ok) {
  throw new Error("Analysis failed")
}

const analysisData = await analysisRes.json()
setAnalysisResult(analysisData)


console.log("Analysis Data:", analysisData); // <-- Debug log
setSectionScores(analysisData.sectionScores || null); // <-- Set section scores

      clearInterval(stepInterval)
      setLoading(false)

      setTargetScore(analysisData.score)

if (analysisData.aiAnalysis) {
  const ai = analysisData.aiAnalysis

  // ✅ Handle Job Match From AI
  
if (ai.jobMatch) {
  setJobMatchScore(ai.jobMatch.overallMatchScore)
  setMissingKeywords(ai.jobMatch.missingRequirements || [])
} else {
  setJobMatchScore(null)
  setMissingKeywords([])
}
  

  const formattedFeedback = `
EXECUTIVE SUMMARY:
${ai.executiveSummary}

STRENGTHS:
${ai.strengths.map(s => `• ${s}`).join("\n")}

WEAKNESSES:
${ai.weaknesses.map(w => `• ${w}`).join("\n")}

SECTION ANALYSIS:

Contact:
${ai.sectionAnalysis.contact.map(s => `• ${s}`).join("\n")}

Summary:
${ai.sectionAnalysis.summary.map(s => `• ${s}`).join("\n")}

Experience:
${ai.sectionAnalysis.experience.map(s => `• ${s}`).join("\n")}

Skills:
${ai.sectionAnalysis.skills.map(s => `• ${s}`).join("\n")}

Formatting:
${ai.sectionAnalysis.formatting.map(s => `• ${s}`).join("\n")}

IMPROVEMENT SUGGESTIONS:
${ai.improvementSuggestions.map(i => `• ${i}`).join("\n")}
`

  setFeedback(formattedFeedback)
} else {
  setFeedback(analysisData.feedback)
}

setImprovedText(analysisData.improvedText || "")
// setJobMatchScore(analysisData.jobMatchScore)
// setMissingKeywords(analysisData.missingKeywords || [])

    } catch (error) {
      setLoading(false)
      alert(error.message)
    }
  }

  

  // 🎯 Animated Score Counter
  useEffect(() => {
    if (targetScore === 0) return
    let current = 0

    const interval = setInterval(() => {
      current += 2
      if (current >= targetScore) {
        current = targetScore
        clearInterval(interval)
      }
      setScore(current)
    }, 20)

    return () => clearInterval(interval)
  }, [targetScore])

  // 🎉 Confetti Effect
  useEffect(() => {
    if (score > 80 && !loading) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [score, loading])

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  const radius = 45
  const circumference = 2 * Math.PI * radius

  const getScoreColor = () => {
    if (score < 50) return "#ef4444"
    if (score < 80) return "#f59e0b"
    return "#10b981"
  }

  console.log("Section Scores in Component:", sectionScores)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"][Math.floor(Math.random() * 4)],
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* HEADER */}
      <header className="w-full bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
          Resume<span className="text-blue-600">Analyzer</span>
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* Upload + Job Description Row */}
        <div className="mt-6 flex gap-4 items-stretch justify-center">

          {/* Upload Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className="
              cursor-pointer
              bg-white border-2 border-dashed border-gray-300
              rounded-2xl
              p-4 sm:p-5 md:p-6
              text-center 
              hover:border-blue-500 hover:shadow-md
              transition-all duration-300
              basis-2/5 sm:basis-1/3 md:basis-1/3 lg:basis-1/3
               flex flex-col items-center justify-center
            "
          >
            <Upload className="mx-auto text-blue-600" size={28} />
            <h2 className="mt-3 text-sm sm:text-base font-semibold text-gray-800">
              Upload Resume
            </h2>
            <p className="text-xs text-gray-500">
              PDF / DOCX
            </p>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-700 break-all">
                <FileText size={14} />
                {file.name}
              </div>
            )}
          </div>
          

          {/* Job Description */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
            <h3 className="text-xs sm:text-sm uppercase tracking-wide text-gray-500">
              Paste Job Description (Optional)
            </h3>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here to calculate job match score..."
              className="
                mt-3 w-full
                min-h-27.5 sm:min-h-32.5 md:min-h-37.5
                p-3 sm:p-4
                border border-gray-300 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-xs sm:text-sm md:text-base
                resize-none
              "
            />
          </div>

        </div>
        {/* Analyze Button Row */}
<div className="mt-6 flex justify-end">
  <button
    onClick={() => file && analyzeResume(file)}
    disabled={!file || loading}
    className="
      px-6 py-3
      bg-blue-600
      text-white
      text-sm sm:text-base
      font-semibold
      rounded-xl
      shadow-sm
      hover:bg-blue-700
      active:scale-95
      disabled:bg-gray-400
      disabled:cursor-not-allowed
      transition-all duration-200
    "
  >
    {loading ? "Analyzing..." : "Analyze Resume"}
  </button>
</div>

        {(loading || feedback) && (
          <div className="mt-10 space-y-8">

            {/* Score + Feedback */}
            <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">

              {/* ATS Score + Section Breakdown Combined */}
<div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
  <h3 className="text-sm uppercase tracking-wide text-gray-500">
    ATS Score
  </h3>

  <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

    {/* LEFT SIDE — Score Ring */}
    <div className="flex flex-col items-center md:w-1/2">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth="10"
            stroke="#e5e7eb"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth="10"
            stroke={getScoreColor()}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * score) / 100
            }
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: getScoreColor() }}
          >
            {score}%
          </span>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE — Breakdown */}
    {sectionScores && Object.keys(sectionScores).length > 0 && (
      <div className="md:w-1/2 w-full space-y-4">

        <h4 className="text-xs uppercase tracking-wide text-gray-400">
          Section Breakdown
        </h4>

        {Object.entries(sectionScores).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="capitalize text-gray-700">
                {key === "actionVerbs"
                  ? "Action Verb Usage"
                  : key === "quantification"
                  ? "Quantification Score"
                  : key}
              </span>
              <span className="font-semibold text-gray-800">
                {value}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${value}%`,
                  backgroundColor:
                    value < 50
                      ? "#ef4444"
                      : value < 80
                      ? "#f59e0b"
                      : "#10b981"
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
</div>

              {/* Feedback */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                  AI Feedback
                </h3>

                {loading ? (
                  <p className="mt-6 text-blue-600 animate-bounce">
                    {loadingStep}
                  </p>
                ) : (
                  <p className="mt-6 whitespace-pre-line text-gray-700 text-sm sm:text-base">
                    {feedback}
                  </p>
                )}
              </div>
            </div>

            {/* Improved Text */}
            {!loading && improvedText && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                  AI Improved Version
                </h3>
                <p className="mt-4 whitespace-pre-line text-gray-700 text-sm sm:text-base">
                  {improvedText}
                </p>
              </div>
            )}

            {/* Job Match Analysis */}
            {/* Job Match Analysis */}
{!loading && jobMatchScore !== null && (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-sm uppercase tracking-wide text-gray-500">
      Job Match Analysis
    </h3>

    <div className="mt-4">
      <div className="text-3xl font-bold text-blue-600">
        {jobMatchScore}%
      </div>

      {analysisResult?.aiAnalysis?.jobMatch?.reliabilityLevel && (
        <p className="mt-1 text-sm text-gray-600">
          Reliability:{" "}
          <span className="font-semibold">
            {analysisResult.aiAnalysis.jobMatch.reliabilityLevel}
          </span>
        </p>
      )}
    </div>

    {/* Matched Requirements */}
    {analysisResult?.aiAnalysis?.jobMatch?.matchedRequirements?.length > 0 && (
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800">
          Matched Requirements
        </h4>
        <div className="mt-3 space-y-3 text-sm text-gray-700">
          {analysisResult.aiAnalysis.jobMatch.matchedRequirements.map(
            (item, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <p><strong>JD:</strong> {item.jdRequirement}</p>
                <p><strong>Resume Evidence:</strong> {item.resumeEvidence}</p>
                <p><strong>Section:</strong> {item.resumeSection}</p>
                <p><strong>Strength:</strong> {item.matchStrength}</p>
              </div>
            )
          )}
        </div>
      </div>
    )}

    {/* Missing Requirements */}
    {missingKeywords.length > 0 && (
      <div className="mt-6">
        <h4 className="font-semibold text-red-600">
          Missing Requirements
        </h4>
        <div className="flex flex-wrap gap-2 mt-3">
          {missingKeywords.map((word, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Alignment Summary */}
    {analysisResult?.aiAnalysis?.jobMatch?.alignmentSummary && (
      <p className="mt-6 text-sm italic text-gray-600">
        {analysisResult.aiAnalysis.jobMatch.alignmentSummary}
      </p>
    )}
  </div>
)}

            {/* Resume Section Breakdown
            {!loading && sectionScores && Object.keys(sectionScores).length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                  Resume Section Breakdown
                </h3>

                <div className="mt-6 space-y-4">
                  {Object.entries(sectionScores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-700">
                          {key === "actionVerbs"
                            ? "Action Verb Usage"
                            : key === "quantification"
                            ? "Quantification Score"
                            : key}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {value}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${value}%`,
                            backgroundColor:
                              value < 50
                                ? "#ef4444"
                                : value < 80
                                ? "#f59e0b"
                                : "#10b981"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

          </div>
        )}

      </main>

      <style>
        {`
          @keyframes confettiFall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti {
            animation-name: confettiFall;
            animation-timing-function: linear;
          }
        `}
      </style>

    </div>
  )
}

export default ResumeApp