import { useMemo, useEffect, useState } from "react"

function ScoreCard({ score, sectionScores }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius

  const [displayScore, setDisplayScore] = useState(0)

  // Animate score count
  useEffect(() => {
    let start = 0
    const duration = 1400
    const startTime = performance.now()

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1)
      const value = Math.floor(progress * score)
      setDisplayScore(value)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [score])

  const offset = circumference - (displayScore / 100) * circumference

  const scoreColor = useMemo(() => {
  if (displayScore >= 80) return "text-emerald-600"
  if (displayScore >= 60) return "text-amber-500"
  return "text-rose-600"
}, [displayScore])

  const pulseEffect = score >= 85

  const gradientColors = useMemo(() => {
  if (displayScore >= 80)
    return ["#22c55e", "#4ade80", "#16a34a"]

  if (displayScore >= 60)
    return ["#f59e0b", "#fbbf24", "#f59e0b"]

  return ["#ef4444", "#f87171", "#dc2626"]
}, [displayScore])

  return (
    <div className="relative w-full flex flex-col rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-6 md:p-8 transition-all duration-300 hover:shadow-[0_35px_100px_rgba(0,0,0,0.12)] overflow-hidden">

      {/* Accent Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-t-3xl" />

      <h2 className="font-heading text-lg sm:text-xl lg:text-2xl text-gray-950 mb-6 text-center md:text-left tracking-tight">
        ATS Score
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

        {/* Score Ring */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-40 h-40 flex items-center justify-center">

            {/* Glass Glow Background */}
            <div className={`absolute w-32 h-32 rounded-full bg-white/40 backdrop-blur-xl shadow-inner
              ${pulseEffect ? "animate-pulse-glow" : ""}`} />

            <svg width="160" height="160" className="relative z-10">

              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stopColor={gradientColors[0]} />
  <stop offset="50%" stopColor={gradientColors[1]} />
  <stop offset="100%" stopColor={gradientColors[2]} />
</linearGradient>
              </defs>

              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="transparent"
              />

              {/* Progress ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Score Number */}
            <div className="absolute flex flex-col items-center justify-center leading-none">
              <span className={`text-3xl font-bold ${scoreColor}`}>
                {displayScore}%
              </span>
              <span className="text-[11px] text-gray-500 mt-1">
                Overall Score
              </span>
            </div>

          </div>
        </div>

        {/* Section Breakdown */}
        {sectionScores && (
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
              Section Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(sectionScores).map(([section, value], index) => (
                <AnimatedSection
                  key={section}
                  section={section}
                  value={value}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`

        @keyframes fadeInUp {
          0% { opacity:0; transform:translateY(12px); }
          100% { opacity:1; transform:translateY(0); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 10px rgba(34,197,94,0.2),
                        0 0 20px rgba(34,197,94,0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(34,197,94,0.35),
                        0 0 40px rgba(34,197,94,0.35);
          }
          100% {
            box-shadow: 0 0 10px rgba(34,197,94,0.2),
                        0 0 20px rgba(34,197,94,0.2);
          }
        }

        .animate-pulse-glow {
          animation: pulseGlow 2.5s ease-in-out infinite;
        }

      `}</style>

    </div>
  )
}


// Section animation
function AnimatedSection({ section, value, delay }) {
  const [count, setCount] = useState(0)
  const [fillWidth, setFillWidth] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {

      const duration = 1200
      const startTime = performance.now()

      const animate = (time) => {
        const progress = Math.min((time - startTime) / duration, 1)

        setCount(Math.floor(progress * value))
        setFillWidth(progress * value)

        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)

    }, delay)

    return () => clearTimeout(timeout)

  }, [value, delay])

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