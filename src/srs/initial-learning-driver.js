const END_LEARNING_PHASE = -1
export const INTERVALS = [10, 30, 60, 120, 300]

export function updateInstanceStats(instance, performanceRating) {
  // retrieve current stats (both stored and calculated)
  const { difficulty, pastOccurances, learningCount } = instance
  // const dateLastReviewed = pastOccurances[0] ? pastOccurances[0] : new Date()

  // see that card again at the appropriate interval
  const now = new Date()
  const newNextDate = new Date()
  newNextDate.setSeconds(newNextDate.getSeconds() + INTERVALS[learningCount])

  const newPastOccurances = [now, ...pastOccurances]
  const newLearningCount = learningCount > 4 ? END_LEARNING_PHASE : learningCount + 1

  const newInstance = {
    difficulty,
    nextDate: newNextDate,
    learningCount: newLearningCount,
    pastOccurances: newPastOccurances,
  }

  return newInstance
}
