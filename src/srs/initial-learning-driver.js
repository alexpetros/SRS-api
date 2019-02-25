const END_LEARNING_PHASE = -1
const INTERVALS = [10, 30, 60, 120, 300]

function updateInstanceStats(instance, performanceRating) {
  // retrieve current stats (both stored and calculated)
  const { difficulty, pastOccurances, learningCount } = instance
  // const dateLastReviewed = pastOccurances[0] ? pastOccurances[0] : new Date()

  // in case we somehow exceed the learning phase count
  const nextInterval = learningCount >= 4 ? 4 : learningCount

  // see that card again at the appropriate interval
  const now = new Date()
  const newNextDate = new Date()
  newNextDate.setSeconds(newNextDate.getSeconds() + INTERVALS[nextInterval])

  const newPastOccurances = [now, ...pastOccurances]
  const newLearningCount = learningCount >= 4 ? END_LEARNING_PHASE : learningCount + 1

  const newInstance = {
    difficulty,
    nextDate: newNextDate,
    learningCount: newLearningCount,
    pastOccurances: newPastOccurances,
  }

  return newInstance
}

export { INTERVALS, updateInstanceStats }
