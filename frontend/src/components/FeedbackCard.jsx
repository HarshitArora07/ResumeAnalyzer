import { useState, useEffect, useRef } from "react"
import { Copy, Check } from "lucide-react"

function FeedbackCard({ feedback }) {
  const [copied, setCopied] = useState(false)
  const headingsRef = useRef([])

  const handleCopy = () => {
    if (!feedback) return
    navigator.clipboard.writeText(JSON.stringify(feedback, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("underline-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    headingsRef.current.forEach((h3) => {
      if (h3) observer.observe(h3)
    })

    return () => observer.disconnect()
  }, [])

  if (!feedback) {
    return (
      <div className="p-6 text-gray-400 font-body">
        No feedback generated.
      </div>
    )
  }

  const {
    executiveSummary,
    strengths,
    weaknesses,
    sectionAnalysis,
    improvementSuggestions,
    jobMatch
  } = feedback

  const renderH3 = (title, className) => (
    <h3
      ref={(el) => (headingsRef.current.push(el))}
      className={`relative inline-block font-heading text-lg mb-3 tracking-tight ${className} heading-neon`}
    >
      {title}
    </h3>
  )

  return (
    <div className="relative w-full flex flex-col rounded-2xl bg-white shadow-lg border border-gray-100 max-h-[75vh] overflow-hidden">

      {/* Subtle Gradient Top Accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-t-2xl" />

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-8 border-b border-gray-100">
        <h2 className="font-heading text-lg sm:text-xl lg:text-2xl text-gray-950 mb-0 text-center md:text-left tracking-tight">
          AI Feedback
        </h2>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-body text-gray-700 hover:bg-linear-to-r from-indigo-500/30 via-purple-500/30 to-cyan-500/30 hover:border-blue-500 transition"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-7 font-body text-gray-700 leading-relaxed text-justify">

        {/* Executive Summary */}
        <section>
          {renderH3("Executive Summary", "text-gray-900")}
          <p className="text-gray-600">{executiveSummary}</p>
        </section>

        {/* Strengths */}
        <section>
          {renderH3("Strengths", "text-emerald-600")}
          <ul className="space-y-2 list-disc ml-5">
            {strengths?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Weaknesses */}
        <section>
          {renderH3("Weaknesses", "text-rose-600")}
          <ul className="space-y-2 list-disc ml-5">
            {weaknesses?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Section Analysis */}
        <section>
          {renderH3("Section Analysis", "text-purple-600")}
          {Object.entries(sectionAnalysis || {}).map(([section, points]) => (
            <div key={section} className="mb-5">
              <h4 className="font-heading text-base mb-2 capitalize text-gray-900">
                {section}
              </h4>
              <ul className="space-y-2 list-disc ml-5">
                {points?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Improvement Suggestions */}
        <section>
          {renderH3("Improvement Suggestions", "text-blue-600")}
          <ul className="space-y-2 list-disc ml-5">
            {improvementSuggestions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Job Match */}
        {jobMatch && (
          <section>
            {renderH3("Job Alignment Analysis", "text-orange-600")}
            <p className="mb-4 font-medium text-gray-800">
              Match Score: {jobMatch.overallMatchScore}%
              <span className="ml-2 text-sm text-gray-500">
                ({jobMatch.reliabilityLevel})
              </span>
            </p>

            <div className="mb-4">
              <h4 className="font-heading text-base mb-2 text-gray-900">
                Alignment Summary
              </h4>
              <p className="text-gray-600">{jobMatch.alignmentSummary}</p>
            </div>

            {jobMatch.missingRequirements?.length > 0 && (
              <div>
                <h4 className="font-heading text-base mb-2 text-rose-600">
                  Missing Requirements
                </h4>
                <ul className="list-disc ml-5 space-y-2">
                  {jobMatch.missingRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

      </div>

      {/* Neon Underline Styles */}
      <style jsx>{`
        .heading-neon {
          position: relative;
          display: inline-block;
        }
        .heading-neon::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          height: 1.2px; /* thinner underline */
          width: 0;
          background: currentColor;
          box-shadow: 0 0 2px currentColor; /* softer neon glow */
          transition: width 0.6s ease;
        }
        .heading-neon.underline-visible::after {
          width: 100%; /* only under text width */
        }
      `}</style>

    </div>
  )
}

export default FeedbackCard