import { useEffect, useState } from "react"
import Dashboard from "../components/Dashboard"

function DashboardPage() {

  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    const data = localStorage.getItem("analysisResult")
    if (data) setAnalysis(JSON.parse(data))
  }, [])

  if (!analysis) {
    return <div className="p-10 text-center">No analysis found</div>
  }

  return (
    <Dashboard
      score={analysis.score}
      feedback={analysis.aiAnalysis}
      sectionScores={analysis.sectionScores}
      jobMatchScore={analysis.aiAnalysis?.jobMatch?.overallMatchScore}
      missingKeywords={analysis.aiAnalysis?.jobMatch?.missingRequirements}
      originalResumeText={localStorage.getItem("resumeText")}
    />
  )
}

export default DashboardPage