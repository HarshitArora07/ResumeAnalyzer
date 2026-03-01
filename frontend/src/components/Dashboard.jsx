import ScoreCard from "./Scorecard";
import FeedbackCard from "./FeedbackCard";
import ImprovedCard from "./ImprovedCard";
import JobMatchCard from "./JobMatchCard";

function Dashboard({
  score = 0,
  jobMatchScore = null,
  missingKeywords = [],
  improvedText = "",
  feedback = null,
  sectionScores = null
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* TOP ROW: Score + Feedback */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="w-full md:w-1/2 flex">
          <ScoreCard
            score={score}
            sectionScores={sectionScores}
          />
        </div>

        <div className="w-full md:w-1/2 flex">
          <FeedbackCard
            feedback={feedback || { summary: "No feedback yet", strengths: [], weaknesses: [] }}
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

      {/* IMPROVED RESUME TEXT */}
      <div className="mb-8">
        <ImprovedCard improvedText={improvedText || "Your improved resume will appear here"} />
      </div>


    </main>
  );
}

export default Dashboard;