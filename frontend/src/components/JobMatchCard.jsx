function JobMatchCard({ jobMatchScore, missingKeywords }) {
  if (!jobMatchScore) return null

  return (
    <div
  className="
    relative
    w-full
    flex flex-col
    rounded-3xl
    bg-white/70
    backdrop-blur-2xl
    border border-white/40
    shadow-[0_25px_80px_rgba(0,0,0,0.08)]
    p-6 md:p-8
    transition-all duration-300
    hover:shadow-[0_35px_100px_rgba(0,0,0,0.12)]
    overflow-hidden
  "
>
  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 z-20 rounded-t-3xl" />
      <h2 className="font-heading text-lg sm:text-xl lg:text-2xl font-semibold text-gray-950 mb-6 tracking-tight">
        Job Match Analysis
      </h2>

      <p
  className={`text-2xl font-bold mb-6 ${
    jobMatchScore >= 80
      ? "text-emerald-500"
      : jobMatchScore >= 60
      ? "text-amber-500"
      : "text-rose-500"
  }`}
>
        Match Score: {jobMatchScore}%
      </p>

      {missingKeywords?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-rose-500 tracking-tight">
            Missing Keywords:
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {missingKeywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default JobMatchCard