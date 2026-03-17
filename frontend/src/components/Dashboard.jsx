import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import ScoreCard from "./ScoreCard"
import FeedbackCard from "./FeedbackCard"
import JobMatchCard from "./JobMatchCard"

function Dashboard({
  score = 0,
  jobMatchScore = null,
  missingKeywords = [],
  originalResumeText = "",
  feedback = null,
  sectionScores = null
}) {

  const navigate = useNavigate()

  const goToEditor = () => {

    // store resume text for editor page
    localStorage.setItem("resumeText", originalResumeText)

    navigate("/editor")
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
{/* HEADER */}
<div className="mb-6 sm:mb-8 md:mb-10 rounded-xl sm:rounded-2xl 
bg-linear-to-r from-cyan-100 to-pink-200
border border-gray-200 
px-3 sm:px-5 md:px-8 py-3 sm:py-4 md:py-6 
shadow-sm"
>
  <div className="flex items-center justify-between gap-2 sm:gap-4">

    {/* Left */}
    <h1 className="
      text-sm 
      xs:text-base 
      sm:text-xl 
      md:text-2xl 
      lg:text-3xl 
      font-bold 
      tracking-tight 
      whitespace-nowrap
    ">
      Resume Dashboard
    </h1>

    {/* Right Badge */}
    <div className="
      bg-gray-800 
      px-2 sm:px-3 md:px-4 
      py-1 sm:py-1.5 md:py-2 
      rounded-md sm:rounded-lg 
      text-[10px] sm:text-xs md:text-sm 
      text-gray-300 
      whitespace-nowrap
      shrink-0
    ">
      AI Powered ⚡
    </div>

  </div>

</div>
      {/* TOP ROW */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="w-full md:w-1/2 flex">
          <ScoreCard
            score={score}
            sectionScores={sectionScores}
          />
        </div>

        <div className="w-full md:w-1/2 flex">
          <FeedbackCard
            feedback={feedback || {
              summary: "No feedback yet",
              strengths: [],
              weaknesses: []
            }}
          />
        </div>

      </div>

      {/* JOB MATCH */}
      <div className="mb-8">
        <JobMatchCard
          jobMatchScore={jobMatchScore}
          missingKeywords={missingKeywords}
        />
      </div>

      {/* AI IMPROVE CTA */}
      <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white rounded-2xl p-8 text-center shadow-xl">

        <h2 className="text-2xl font-bold mb-2">
          Let AI Improve Your Resume ✨
        </h2>

        <p className="text-indigo-100 mb-6">
          Get Grammarly-style suggestions and stronger bullet points instantly.
        </p>

        <button
          onClick={goToEditor}
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:scale-105 transition"
        >
          Improve My Resume
          <ArrowRight size={18} />
        </button>

      </div>

    </main>
  )
}

export default Dashboard