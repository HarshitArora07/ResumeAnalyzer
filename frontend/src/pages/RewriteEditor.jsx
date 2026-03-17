import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Check, X, Download, Sparkles } from "lucide-react"
import { jsPDF } from "jspdf"

function RewriteEditor() {
  const navigate = useNavigate()

  const [resumeText, setResumeText] = useState("")
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(false)

  // ✅ Highlight changed words
  const highlightDiff = (original, suggestion) => {
    const origWords = new Set(original.split(" "))

    return suggestion.split(" ").map((word, i) => (
      <span
        key={i}
        className={
          origWords.has(word)
            ? ""
            : "bg-green-200 px-1 rounded"
        }
      >
        {word + " "}
      </span>
    ))
  }

  useEffect(() => {
    const text = localStorage.getItem("resumeText")
    if (!text) navigate("/dashboard")

    setResumeText(text)
  }, [])

  useEffect(() => {
    if (!resumeText) return

    const fetchSuggestions = async () => {
      setLoading(true)

      try {
        const res = await fetch(
          "http://localhost:5000/api/rewrite/suggestions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: resumeText })
          }
        )

        const data = await res.json()

        // ✅ Store original safely
        const mapped = (data.suggestions || []).map((line) => ({
          ...line,
          baseOriginal: line.original,
          status: "pending"
        }))

        setLines(mapped)
      } catch (err) {
        console.error(err)
      }

      setLoading(false)
    }

    fetchSuggestions()
  }, [resumeText])

  // ✅ Accept
  const acceptSuggestion = (index) => {
    setLines((prev) =>
      prev.map((line, i) =>
        i === index
          ? {
              ...line,
              original: line.suggestion,
              status: "accepted"
            }
          : line
      )
    )
  }

  // ✅ Reject
  const rejectSuggestion = (index) => {
    setLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, status: "rejected" } : line
      )
    )
  }

  // ✅ Undo Accept
  const undoAccept = (index) => {
    setLines((prev) =>
      prev.map((line, i) =>
        i === index
          ? {
              ...line,
              original: line.baseOriginal,
              status: "pending"
            }
          : line
      )
    )
  }

  // ✅ PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF()

    let y = 10

    lines.forEach((line) => {
      doc.text(line.original, 10, y)
      y += 8
    })

    doc.save("Improved_Resume.pdf")
  }

  const accepted = lines.filter((l) => l.status === "accepted").length
  const total = lines.length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <h1 className="font-bold text-lg flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={20} />
          AI Resume Rewrite Editor
        </h1>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Download size={16} />
          Export PDF
        </button>

      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="font-semibold text-lg mb-4">
            AI Suggestions
          </h2>

          {loading && (
            <p className="text-gray-500">
              Generating smart suggestions...
            </p>
          )}

          {!loading && lines.length === 0 && (
            <p className="text-gray-500">
              No suggestions available
            </p>
          )}

          <div className="space-y-4 max-h-150 overflow-y-auto">

            {lines.map((line, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg transition
                  ${line.status === "accepted" ? "bg-green-50 border-green-200" : ""}
                  ${line.status === "rejected" ? "bg-red-50 border-red-200" : ""}
                `}
              >

                <div className="text-sm leading-relaxed space-y-2">

                  {/* ORIGINAL */}
                  <p className="text-gray-600">
                    <span className="font-semibold text-xs text-gray-400 block">
                      Original
                    </span>
                    {line.baseOriginal}
                  </p>

                  {/* SUGGESTED */}
                  {line.status === "pending" && (
                    <p className="text-green-700">
                      <span className="font-semibold text-xs text-green-500 block">
                        Suggested
                      </span>
                      {highlightDiff(line.baseOriginal, line.suggestion)}
                    </p>
                  )}

                  {/* ACCEPTED */}
                  {line.status === "accepted" && (
                    <>
                      <p className="text-green-700 font-medium">
                        <span className="text-xs text-green-500 block">
                          Updated
                        </span>
                        {line.original}
                      </p>

                      <button
                        onClick={() => undoAccept(index)}
                        className="mt-2 text-xs text-indigo-600 hover:underline"
                      >
                        Undo
                      </button>
                    </>
                  )}

                </div>

                {/* ACTIONS */}
                {line.status === "pending" && (
                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => acceptSuggestion(index)}
                      className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      <Check size={14} />
                      Accept
                    </button>

                    <button
                      onClick={() => rejectSuggestion(index)}
                      className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      <X size={14} />
                      Reject
                    </button>

                  </div>
                )}

              </div>
            ))}

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">

          <h2 className="font-semibold text-lg mb-4">
            Live Resume Preview
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 text-sm leading-relaxed flex-1 overflow-y-auto">

            {lines.map((line, i) => (
              <p key={i}>{line.original}</p>
            ))}

          </div>

          {/* STATS */}
          <div className="mt-6 bg-indigo-50 rounded-lg p-4">

            <h3 className="font-semibold text-indigo-700 mb-2">
              Rewrite Progress
            </h3>

            <p className="text-sm text-gray-600">
              Accepted Improvements:{" "}
              <span className="font-bold">{accepted}</span> / {total}
            </p>

            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-indigo-600 h-2 rounded transition-all"
                style={{
                  width: `${total ? (accepted / total) * 100 : 0}%`
                }}
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default RewriteEditor