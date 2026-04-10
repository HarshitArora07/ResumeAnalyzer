import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { User } from "lucide-react"

import InputSection from "../components/InputSection"

function ResumeApp() {
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [jobDescription, setJobDescription] = useState("")

  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef()


  // ✅ SAFE USER PARSE (FIXES CRASH)
  const getUserFromStorage = () => {
    try {
      const data = localStorage.getItem("user")
      if (!data || data === "undefined") return {}
      return JSON.parse(data)
    } catch {
      return {}
    }
  }

  const user = getUserFromStorage()

  // ✅ PROTECT ROUTE (optional but important)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/", { replace: true })
    }
  }, [])

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadingMessages = [
    "Uploading resume...",
    "Extracting resume content...",
    "Calculating ATS score...",
    "Generating AI feedback..."
  ]

  const analyzeResume = async () => {
    try {

      const API = import.meta.env.VITE_API_BASE;

    // ✅ ADD THIS HERE
    if (!API) {
      alert("API not configured");
      return;
    }

      if (!file) return

      setLoading(true)

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

      const uploadRes = await fetch(`${API}/api/resume/upload`, {
        method: "POST",
        body: formData
      })

      if (!uploadRes.ok) {
        throw new Error("Resume upload failed")
      }

      const resumeData = await uploadRes.json()
      const extractedText = resumeData.extractedText || ""

      localStorage.setItem("resumeText", extractedText)

      const token = localStorage.getItem("token")

      // ✅ HANDLE TOKEN MISSING
      if (!token) {
        throw new Error("Session expired. Please login again.")
      }

      const analysisRes = await fetch(`${API}/api/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: extractedText,
          jobDescription: jobDescription.trim() || null
        })
      })

      if (!analysisRes.ok) {
        throw new Error("Analysis failed")
      }

      const analysisData = await analysisRes.json()

      localStorage.setItem(
        "analysisResult",
        JSON.stringify(analysisData)
      )

      clearInterval(stepInterval)
      setLoading(false)

      navigate("/dashboard")

    } catch (err) {
      console.error(err)
      setLoading(false)

      // ✅ AUTO LOGOUT IF TOKEN ISSUE
      if (err.message.includes("Session expired")) {
        localStorage.clear()
        navigate("/")
      }

      alert(err.message || "Something went wrong")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">

        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Resume<span className="text-blue-600">Analyzer</span>
        </h1>

        {/* Profile Dropdown */}
        <div ref={menuRef} className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
  <User className="text-white w-4 h-4" />
</div>

            {/* Name */}
            <span className="font-medium">
              {user?.name || "User"}
            </span>
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border z-50 overflow-hidden animate-fadeIn">

              <button
                onClick={() => {
                  navigate("/history")
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-500"
              >
                📜 History
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-500"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}

        </div>

      </header>

      {/* Upload Section */}
      <InputSection
        file={file}
        setFile={setFile}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        analyzeResume={analyzeResume}
        loading={loading}
        loadingStep={loadingStep}
      />

    </div>
  )
}

export default ResumeApp