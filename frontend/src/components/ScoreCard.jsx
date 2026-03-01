import { useMemo, useEffect, useState } from "react"

function ScoreCard({ score, sectionScores }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const ringColor = useMemo(() => {
    if (score >= 80) return "#22c55e"
    if (score >= 60) return "#f59e0b"
    return "#ef4444"
  }, [score])

  return (
    <div className="relative w-full flex flex-col rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-6 md:p-8 transition-all duration-300 hover:shadow-[0_35px_100px_rgba(0,0,0,0.12)] overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 z-20 rounded-t-3xl" />

      <h2 className="font-heading text-lg sm:text-xl lg:text-2xl text-gray-950 mb-6 text-center md:text-left tracking-tight">
        ATS Score
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* LEFT — Score Ring */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-40 h-40">
            <svg width="160" height="160">
              <circle cx="80" cy="80" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={ringColor}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-4xl font-bold text-gray-950">{score}%</span>
              <span className="text-[11px] text-gray-500 mt-1">Overall Score</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Section Breakdown */}
        {sectionScores && (
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
              Section Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(sectionScores).map(([section, value], index) => (
                <AnimatedSection key={section} section={section} value={value} delay={index * 200} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tailwind Keyframe Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }
      `}</style>
    </div>
  )
}

// Component for each animated section row
function AnimatedSection({ section, value, delay }) {
  const [count, setCount] = useState(0)
  const [fillWidth, setFillWidth] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Animate count
      let start = 0
      const duration = 1200 // 1.2s
      const startTime = performance.now()

      const animate = (time) => {
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        setCount(Math.floor(progress * value))
        setFillWidth(progress * value)

        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  // Determine dynamic bar color based on current fill
  const barColor =
    fillWidth >= 80
      ? "bg-emerald-500"
      : fillWidth >= 60
      ? "bg-amber-400"
      : "bg-rose-500"

  return (
    <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between text-sm mb-1">
        <span className="capitalize text-gray-700 font-medium">{section}</span>
        <span className="font-semibold text-gray-900">{count}%</span>
      </div>

      <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden">
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
    </div>
  )
}

export default ScoreCard