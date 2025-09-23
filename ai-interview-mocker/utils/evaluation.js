// Basic word overlap similarity (safe version)
export function computeSimilarity(userAns, correctAns) {
  // Ensure both inputs are strings
  const userStr = typeof userAns === "string"
    ? userAns
    : userAns && typeof userAns === "object"
      ? Object.values(userAns).join(" ") // flatten JSON answers
      : "";

  const correctStr = typeof correctAns === "string" ? correctAns : "";

  // Split into words and lowercase
  const userWords = userStr.toLowerCase().split(/\s+/).filter(Boolean);
  const correctWords = correctStr.toLowerCase().split(/\s+/).filter(Boolean);

  // Find common words
  const common = userWords.filter(w => correctWords.includes(w));

  // Return ratio
  return correctWords.length ? common.length / correctWords.length : 0;
}
