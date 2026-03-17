import { useEffect, useState } from "react"
import { Trash2, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:5000/api/history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setHistory(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Delete this record?")
    if (!confirmDelete) return

    await fetch(`http://localhost:5000/api/history/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    setHistory(prev => prev.filter(item => item._id !== id))
  }

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold tracking-wide">
          Resume History
        </h1>
      </header>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">

        {/* Loading */}
        {loading && (
          <div className="text-center mt-20 text-gray-400 animate-pulse">
            Loading history...
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold mb-2">
              No History Found
            </h2>
            <p className="text-gray-400 mb-6">
              Start analyzing resumes to see them here.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Analyze Resume
            </button>
          </div>
        )}

        {/* Timeline */}
        {!loading && history.length > 0 && (
          <div className="relative">

            {/* Line */}
            <div className="absolute left-4 top-0 w-1 h-full bg-white/10"></div>

            {history.map((item) => (
              <div key={item._id} className="relative pl-12 mb-10">

                {/* Dot */}
                <div className="absolute left-2 top-6 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 hover:scale-[1.01] transition-all duration-300">

                  {/* Top Row */}
                  <div className="flex justify-between items-start">

                    <div>
                      <h2 className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}/100
                      </h2>

                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>

                      {item.jobMatchScore !== null && (
                        <p className="mt-2 text-sm text-blue-400">
                          Job Match: {item.jobMatchScore}%
                        </p>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Resume */}
                  <details className="mt-5 group">
                    <summary className="cursor-pointer text-blue-400 font-medium group-hover:underline">
                      View Original Resume
                    </summary>

                    <div className="mt-3 text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto border border-white/10 p-3 rounded-lg bg-black/30">
                      {item.resumeText}
                    </div>
                  </details>

                  {/* Improved */}
                  {item.improvedText && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer text-green-400 font-medium group-hover:underline">
                        View AI Improved Version
                      </summary>

                      <div className="mt-3 text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto border border-white/10 p-3 rounded-lg bg-black/30">
                        {item.improvedText}
                      </div>
                    </details>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default History