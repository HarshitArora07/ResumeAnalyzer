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
    analyzeResume(selectedFile)
  }

  const analyzeResume = async (selectedFile) => {
    try {
      setLoading(true)
      setScore(0)
      setTargetScore(0)
      setFeedback("")
      setImprovedText("")
      setShowConfetti(false)

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
          // headers: {
          //   Authorization: `Bearer ${token}`
          // },
          body: formData
        }
      )

      if (!uploadRes.ok) {
        throw new Error("Resume upload failed")
      }

      const resumeData = await uploadRes.json()

      // 2️⃣ Analyze Resume
      const analysisRes = await fetch(
  "http://localhost:5000/api/analysis",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: resumeData.extractedText })
  }
)

      if (!analysisRes.ok) {
        throw new Error("Analysis failed")
      }

      const analysisData = await analysisRes.json()

      clearInterval(stepInterval)
      setLoading(false)

      setTargetScore(analysisData.score)
      setFeedback(analysisData.feedback)
      setImprovedText(analysisData.improvedText)

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
      <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">

        {/* Upload */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:shadow-md transition-all duration-300"
        >
          <Upload className="mx-auto text-blue-600" size={36} />
          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            Drag & Drop Resume Here
          </h2>
          <p className="text-sm text-gray-500">
            or click to upload (PDF / DOCX)
          </p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {file && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700">
              <FileText size={16} />
              {file.name}
            </div>
          )}
        </div>

        {(loading || feedback) && (
          <div className="mt-10 space-y-8">

            <div className="flex flex-row gap-6 w-full items-stretch">

              {/* ATS Score */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                  ATS Score
                </h3>

                <div className="mt-6 relative w-44 h-44">
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
                      className="text-3xl font-bold"
                      style={{ color: getScoreColor() }}
                    >
                      {score}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-sm uppercase tracking-wide text-gray-500">
                  AI Feedback
                </h3>

                {loading ? (
                  <p className="mt-6 text-blue-600 animate-pulse">
                    {loadingStep}
                  </p>
                ) : (
                  <p className="mt-6 whitespace-pre-line text-gray-700">
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
                <p className="mt-4 whitespace-pre-line text-gray-700">
                  {improvedText}
                </p>
              </div>
            )}

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