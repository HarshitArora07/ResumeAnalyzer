import { useRef, useState, useEffect } from "react"
import { Upload, FileText, X } from "lucide-react"

function InputSection({
  file,
  setFile,
  jobDescription,
  setJobDescription,
  analyzeResume,
  loading
}) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [metricsCounts, setMetricsCounts] = useState([0, 0, 0, 0])
  const metricsRef = useRef(null)
  const [metricsAnimated, setMetricsAnimated] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => setDragActive(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const removeFile = () => setFile(null)

  const uploadStateClasses = file
    ? "border-green-500 bg-green-50/40"
    : dragActive
    ? "border-blue-600 bg-blue-50/40 shadow-md"
    : "border-gray-300 hover:border-blue-600 hover:bg-blue-50/30"

  // Animate metrics when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !metricsAnimated) {
          setMetricsAnimated(true)
          const metricsValues = [95, 120, 4.8, null]
          const animationDuration = 2000 // 2s
          const startTime = performance.now()

          function animate(time) {
            const elapsed = time - startTime
            setMetricsCounts(metricsValues.map((val, idx) => {
              if (val === null) return null
              const progress = Math.min(elapsed / animationDuration, 1)
              const value = val % 1 !== 0 ? Math.round(val * progress * 10) / 10 : Math.round(val * progress)
              return value
            }))

            if (elapsed < animationDuration) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 } // triggers when 30% of section is visible
    )

    if (metricsRef.current) observer.observe(metricsRef.current)

    return () => {
      if (metricsRef.current) observer.unobserve(metricsRef.current)
    }
  }, [metricsAnimated])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 font-body">

      <div className="flex gap-6">

        {/* Upload Box */}
        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            basis-1/3
            relative
            bg-white
            border-2 border-dashed
            rounded-2xl
            p-8
            flex items-center justify-center
            text-center
            cursor-pointer
            transition-all duration-300
            ${uploadStateClasses}
          `}
        >
          {/* Upload State */}
          <div
            className={`
              absolute inset-0
              flex flex-col items-center justify-center
              transition-all duration-300
              ${file ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
            `}
          >
            <Upload
              className={`mb-3 transition-colors duration-300 ${dragActive ? "text-blue-600" : "text-gray-500"}`}
              size={30}
            />
            <h2 className="font-heading text-lg text-gray-900 tracking-tight">
              Upload Resume
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop or click to browse
            </p>
          </div>

          {/* File Uploaded State */}
          <div
            className={`
              absolute inset-0
              flex flex-col items-center justify-center
              transition-all duration-300
              ${file ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
          >
            {file && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-800 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                  <FileText size={16} className="text-green-600" />
                  <span className="truncate max-w-45">{file.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile() }}
                    className="ml-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-green-600 mt-3 font-medium">
                  File uploaded successfully
                </p>
              </>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Job Description Box */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="
              w-full
              min-h-40
              p-4
              border border-gray-200
              rounded-xl
              outline-none
              focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
            placeholder="Paste Job Description..."
          />
        </div>

      </div>

      {/* Analyze Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={analyzeResume}
          disabled={!file || loading}
          className="
            px-6 py-3
            bg-blue-600
            text-white
            rounded-xl
            font-medium
            transition
            hover:bg-blue-700
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* Features Section */}
      <section className="mt-14 relative bg-linear-to-b from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl md:rounded-3xl py-16 font-body">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-gray-900 tracking-tight font-bold">
              Powerful Resume Insights
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg font-body">
              Everything you need to optimize your resume and improve your job match score.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "📊", title: "ATS Score", desc: "Get an instant compatibility score based on applicant tracking system standards.", color: "indigo" },
              { icon: "🔍", title: "Keyword Analysis", desc: "Detect missing keywords and optimize your resume for the specific job description.", color: "purple" },
              { icon: "📈", title: "Section Breakdown", desc: "Detailed scoring for each resume section so you know exactly what to improve.", color: "emerald" },
              { icon: "💡", title: "Smart Suggestions", desc: "AI-powered improvement tips tailored to your resume and target role.", color: "amber" }
            ].map((f, idx) => (
              <div
                key={idx}
                className={`group bg-white border border-gray-200 rounded-2xl p-6 shadow-md 
                  hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] 
                  hover:border-blue-500 
                  transition-all duration-1200 ease-in-out 
                  transform hover:-translate-y-2 hover:scale-105`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full 
                                  bg-linear-to-tr from-${f.color}-100 to-${f.color}-300 
                                  text-${f.color}-700 shadow-inner shrink-0`}>
                    {f.icon}
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-semibold text-gray-900">
                    {f.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base text-justify font-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section ref={metricsRef} className="mt-20 bg-white rounded-2xl md:rounded-3xl py-16 font-body shadow-lg">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl text-gray-900 font-bold tracking-tight">
              Why Choose Our AI Resume Platform
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Get smarter insights, optimize for ATS, and boost your job match score instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-indigo-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-heading text-4xl font-bold text-indigo-600 mb-2">
                {metricsCounts[0]}%
              </h3>
              <p className="text-gray-700 font-body text-sm">Average ATS Compatibility Score</p>
            </div>
            <div className="p-6 bg-pink-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-heading text-4xl font-bold text-pink-600 mb-2">
                +{metricsCounts[1]}
              </h3>
              <p className="text-gray-700 font-body text-sm">Keywords Optimized Per Resume</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-heading text-4xl font-bold text-emerald-600 mb-2">
                {metricsCounts[2]}/5
              </h3>
              <p className="text-gray-700 font-body text-sm">User Satisfaction Rating</p>
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-heading text-4xl font-bold text-amber-600 mb-2">
                Instant
              </h3>
              <p className="text-gray-700 font-body text-sm">Get actionable insights in seconds</p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <h3 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold mb-4">
              Ready to Boost Your Resume?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto font-body">
              Upload your resume now and see how our AI insights can improve your job prospects instantly.
            </p>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
              Analyze My Resume
            </button>
          </div>

        </div>
      </section>

    </main>
  )
}

export default InputSection