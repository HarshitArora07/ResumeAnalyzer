import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"

import InputSection from "../components/InputSection"
import Dashboard from "../components/Dashboard"

function ResumeApp() {

  const [file, setFile] = useState(null)
  const [score, setScore] = useState(0)
  const [targetScore, setTargetScore] = useState(0)

  // ✅ FIX: feedback should be null (object later), not string
  const [feedback, setFeedback] = useState(null)

  const [improvedText, setImprovedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  const [jobDescription, setJobDescription] = useState("")
  const [jobMatchScore, setJobMatchScore] = useState(null)
  const [missingKeywords, setMissingKeywords] = useState([])
  const [sectionScores, setSectionScores] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)

  const loadingMessages = [
    "Uploading resume...",
    "Extracting resume content...",
    "Calculating ATS score...",
    "Generating AI feedback..."
  ]

  const analyzeResume = async () => {
    try {
      if (!file) return

      setLoading(true)
      setScore(0)
      setTargetScore(0)
      setFeedback(null)
      setImprovedText("")
      setShowConfetti(false)
      setJobMatchScore(null)
      setMissingKeywords([])
      setSectionScores(null)

      let stepIndex = 0

      const stepInterval = setInterval(() => {
        setLoadingStep(loadingMessages[stepIndex])
        stepIndex++
        if (stepIndex === loadingMessages.length) {
          clearInterval(stepInterval)
        }
      }, 1000)

      const formData = new FormData()
      formData.append("resume", file)

      // Upload resume
      const uploadRes = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData
      })

      if (!uploadRes.ok) {
        throw new Error("Resume upload failed")
      }

      const resumeData = await uploadRes.json()

      // Analyze resume
      const analysisRes = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: resumeData.extractedText,
          jobDescription: jobDescription.trim() || null
        })
      })

      if (!analysisRes.ok) {
        throw new Error("Analysis failed")
      }

      const analysisData = await analysisRes.json()

      // ✅ Always ensure object shape
      const safeAI = analysisData?.aiAnalysis && typeof analysisData.aiAnalysis === "object"
        ? analysisData.aiAnalysis
        : null

      setAnalysisResult(analysisData || null)
      setSectionScores(analysisData?.sectionScores || null)
      setTargetScore(analysisData?.score || 0)

      // Job match (safe access)
      if (safeAI?.jobMatch?.overallMatchScore !== undefined) {
        setJobMatchScore(safeAI.jobMatch.overallMatchScore || 0)
        setMissingKeywords(
          safeAI.jobMatch.missingRequirements || []
        )
      }

      setFeedback(safeAI)
      setImprovedText(analysisData?.improvedText || "")

      clearInterval(stepInterval)
      setLoading(false)

    } catch (err) {
      console.error(err)
      setLoading(false)
      alert(err.message || "Something went wrong")
    }
  }

  // Animated score
  useEffect(() => {
    if (!targetScore) return

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

  // Confetti
  useEffect(() => {
    if (score > 80 && !loading) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [score, loading])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"][
                  Math.floor(Math.random() * 4)
                ],
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <header className="w-full bg-white border-b px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">
          Resume<span className="text-blue-600">Analyzer</span>
        </h1>
        <div className="flex items-center"><button onClick={handleLogout} className="text-red-500">
          <LogOut size={18} />
        </button>
        <h2 className="text-red-500 ml-2">Logout</h2>
        </div>
      </header>

      {!analysisResult ? (
        <InputSection
          file={file}
          setFile={setFile}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          analyzeResume={analyzeResume}
          loading={loading}
        />
      ) : (
        <Dashboard
          score={score}
          loading={loading}
          loadingStep={loadingStep}
          feedback={feedback}
          improvedText={improvedText}
          jobMatchScore={jobMatchScore}
          missingKeywords={missingKeywords}
          analysisResult={analysisResult}
          sectionScores={sectionScores}
        />
      )}

    </div>
  )
}

export default ResumeApp