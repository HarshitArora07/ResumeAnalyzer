function ImprovedCard({ improvedText }) {
  if (!improvedText) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">
        AI Improved Version
      </h2>

      <pre className="whitespace-pre-wrap text-sm text-gray-700">
        {improvedText}
      </pre>
    </div>
  )
}

export default ImprovedCard