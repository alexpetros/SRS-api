const PERFORMANCE_THRESHOLD = 0.6

export function updateInstanceStats(instance, performanceRating) {
  // retrieve current stats (both stored and calculated)
  const isCorrect = performanceRating > PERFORMANCE_THRESHOLD
  const { difficulty, pastOccurances, nextDate } = instance
  const dateLastReviewed = pastOccurances[0] ? pastOccurances[0] : new Date()
  const daysBetweenReviews = nextDate.getDate() - dateLastReviewed.getDate()


}
