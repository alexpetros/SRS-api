/* eslint-disable import/prefer-default-export */
// http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
const MIN_PERCENT_OVERDUE = 2
const PERFORMANCE_THRESHOLD = 0.6

function calculateDifficulty(percentOverdue, performanceRating) {
  const difficulty = percentOverdue * (1 / 17) * (8 - 9 * performanceRating)

  // clamp to [0,1]
  if (difficulty < 0) {
    return 0
  } else if (difficulty > 1) {
    return 1
  } else {
    return difficulty
  }
}

function calculateDifficultyWeight(difficulty) {
  return 3 - 1.7 * difficulty
}

function calculateDaysToNextReview(difficultyWeight, percentOverdue, isCorrect) {
  if (isCorrect) {
    return 1 + (difficultyWeight - 1) * percentOverdue
  } else {
    const days = 1 / (difficultyWeight ** 2)
    return days < 1 ? 1 : days
  }
}

/**
 * calculate percent that the item is overdue (min 2%)
 * @param  {Date} dateLastReviewed - last time the object was seen
 * @param  {integer} daysBetweenReviews - days until it should be see next
 * @return {float} percent that the item is overdue
 */
function calculatePercentOverdue(dateLastReviewed, daysBetweenReviews, isCorrect) {
  const now = new Date()
  const daysLate = now.getDate() - dateLastReviewed.getDate()
  const percentOverdue = daysLate / daysBetweenReviews

  if (isCorrect) {
    return Math.min(percentOverdue, MIN_PERCENT_OVERDUE)
  } else {
    return 1
  }
}

/**
 * updates a card after a user sees it and responds
 * there are a few unanswered questions here with respect to date truncating
 * for now I'm erring on the side of seeing it again sooner
 *
 * @param  {Object} instance
 * @param  {integer} performanceRating - user's performance scaled [0,1]
 * @return {Object} new card to be saved to db
 */
export function updateCardStats(instance, performanceRating) {
  // retrieve current stats (both stored and calculated)
  const isCorrect = performanceRating > PERFORMANCE_THRESHOLD
  const { pastOccurances, nextDate } = instance
  const dateLastReviewed = pastOccurances[0]
  const daysBetweenReviews = nextDate.getDate() - dateLastReviewed.getDate()

  // calculate new stats
  const now = new Date()
  const percentOverdue = calculatePercentOverdue(dateLastReviewed, daysBetweenReviews, isCorrect)
  const newDifficulty = calculateDifficulty(percentOverdue, performanceRating)
  const newDifficultyWeight = calculateDifficultyWeight(newDifficulty)
  const daysToNextReivew = calculateDaysToNextReview(newDifficultyWeight, percentOverdue, isCorrect)

  // update instance history
  const newPastOccurances = [now, ...pastOccurances]
  const newNextDate = new Date(now)
  newNextDate.setDate(now.getDate() + daysToNextReivew)

  const newInstance = {
    ...instance,
    difficulty: newDifficulty,
    nextDate: newNextDate,
    pastOccurances: newPastOccurances,
  }

  return newInstance
}
