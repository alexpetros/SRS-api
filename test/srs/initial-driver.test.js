import { updateInstanceStats, INTERVALS } from '../../src/srs/initial-learning-driver'


// time constants
const MS_IN_SEC = 1000
// const MS_IN_DAYS = 86400000

// default constants
const TEST_USER_ID = 1
const TEST_CARD_ID = 12
const DEFAULT_DIFFICULTY = 0.3
const LEARNING_COUNT_START = 0
const SUCCESS_PERFORMANCE = 0.8

// default dates
const NOW = new Date()
const YESTERDAY = new Date(NOW)
YESTERDAY.setDate(NOW.getDate() - 1)
const TWO_DAYS_AGO = new Date(NOW)
TWO_DAYS_AGO.setDate(NOW.getDate() - 2)
const ONE_PAST_OCCURANCE = [TWO_DAYS_AGO]


describe('srs difficulty and date calcuations', () => {
  const testInstance = {
    userId: TEST_USER_ID,
    cardId: TEST_CARD_ID,
    difficulty: DEFAULT_DIFFICULTY,
    nextDate: NOW,
    pastOccurances: ONE_PAST_OCCURANCE,
    learningCount: LEARNING_COUNT_START,
  }

  it('sets the next review for 10 seconds on first interval', () => {
    const newInstance = updateInstanceStats(testInstance, SUCCESS_PERFORMANCE)
    const secondsUntil = (newInstance.nextDate - NOW) / MS_IN_SEC
    expect(secondsUntil).toBeGreaterThan(INTERVALS[0])
    expect(secondsUntil).toBeLessThan(INTERVALS[0] + 1)
  })

  it('sets the next review for 30 seconds on second interval', () => {
    testInstance.learningCount = 1
    const newInstance = updateInstanceStats(testInstance, SUCCESS_PERFORMANCE)
    const secondsUntil = (newInstance.nextDate - NOW) / MS_IN_SEC
    expect(secondsUntil).toBeGreaterThan(INTERVALS[1])
    expect(secondsUntil).toBeLessThan(INTERVALS[1] + 1)
  })

  it('sets the next review for 60 seconds on first interval', () => {
    testInstance.learningCount = 2
    const newInstance = updateInstanceStats(testInstance, SUCCESS_PERFORMANCE)
    const secondsUntil = (newInstance.nextDate - NOW) / MS_IN_SEC
    expect(secondsUntil).toBeGreaterThan(INTERVALS[2])
    expect(secondsUntil).toBeLessThan(INTERVALS[2] + 1)
  })

  it('sets the next review for 120 seconds on first interval', () => {
    testInstance.learningCount = 3
    const newInstance = updateInstanceStats(testInstance, SUCCESS_PERFORMANCE)
    const secondsUntil = (newInstance.nextDate - NOW) / MS_IN_SEC
    expect(secondsUntil).toBeGreaterThan(INTERVALS[3])
    expect(secondsUntil).toBeLessThan(INTERVALS[3] + 1)
  })

  it('sets the next review for 300 seconds on first interval', () => {
    testInstance.learningCount = 4
    const newInstance = updateInstanceStats(testInstance, SUCCESS_PERFORMANCE)
    const secondsUntil = (newInstance.nextDate - NOW) / MS_IN_SEC
    expect(secondsUntil).toBeGreaterThan(INTERVALS[4])
    expect(secondsUntil).toBeLessThan(INTERVALS[4] + 1)
  })
})

// needs to not break down when fed NaN difficulty of invalid date

// describe('driver robustness', () => {
//   it('handles one past occurance')
// })
