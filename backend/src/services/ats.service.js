export const calculateATSScore = (text) => {
  let score = 50

  if (text.includes("experience")) score += 10
  if (text.includes("project")) score += 10
  if (text.includes("skills")) score += 10
  if (text.length > 1000) score += 10

  return Math.min(score, 100)
}