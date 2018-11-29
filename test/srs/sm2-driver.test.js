import { updateInstanceStats } from '../../src/srs'

// default constants
const TEST_USER_ID = 1
const TEST_CARD_ID = 12
const DEFAULT_DIFFICULTY = 0.3

// default dates
const NOW = new Date()
const YESTERDAY = new Date(NOW)
YESTERDAY.setDate(NOW.getDate() - 1)
const TWO_DAYS_AGO = new Date(NOW)
TWO_DAYS_AGO.setDate(NOW.getDate() - 2)
const ONE_PAST_OCCURANCE = [TWO_DAYS_AGO]



describe('srs date sequence', () => {
  const testInstance = {
    userId: TEST_USER_ID,
    cardId: TEST_CARD_ID,
    difficulty: DEFAULT_DIFFICULTY,
    nextDate: NOW,
    pastOccurances: ONE_PAST_OCCURANCE,
  }

  it('increases difficulty if you get it wrong', () => {
    const newInstance = updateInstanceStats(testInstance, 0.2)
    expect(newInstance.difficulty).toBeGreaterThan(testInstance.difficulty)
  })

  it('increases difficulty if you get it right (not confident)', () => {
    const newInstance = updateInstanceStats(testInstance, 0.8)
    expect(newInstance.difficulty).toBeGreaterThan(testInstance.difficulty)
  })

  it('decreases difficulty if you get it right (confident)', () => {
    const newInstance = updateInstanceStats(testInstance, 1)
    expect(newInstance.difficulty).toBeLessThan(testInstance.difficulty)
  })
})
