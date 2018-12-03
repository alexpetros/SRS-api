/* eslint no-unused-vars: 0 */
import { updateInstanceStats } from '../../src/srs'

// time constants
const MS_IN_DAYS = 86400000

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

// answer constants
const LOW_CONFIDENCE_FAILURE = 0
const MED_CONFIDENCE_FAILURE = 0.2
const HIGH_CONFIDENCE_FAILURE = 0.4
const LOW_CONFIDENCE_SUCCESS = 0.6
const MED_CONFIDENCE_SUCCESS = 0.8
const HIGH_CONFIDENCE_SUCCESS = 1


describe('srs difficulty and date calcuations', () => {
  const testInstance = {
    userId: TEST_USER_ID,
    cardId: TEST_CARD_ID,
    difficulty: DEFAULT_DIFFICULTY,
    nextDate: NOW,
    pastOccurances: ONE_PAST_OCCURANCE,
  }

  it('increases difficulty if you get it wrong', () => {
    const newInstance = updateInstanceStats(testInstance, MED_CONFIDENCE_FAILURE)
    expect(newInstance.difficulty).toBeGreaterThan(testInstance.difficulty)
  })

  it('increases difficulty if you get it right (not confident)', () => {
    const newInstance = updateInstanceStats(testInstance, MED_CONFIDENCE_SUCCESS)
    expect(newInstance.difficulty).toBeGreaterThan(testInstance.difficulty)
  })

  it('decreases difficulty if you get it right (confident)', () => {
    const newInstance = updateInstanceStats(testInstance, HIGH_CONFIDENCE_SUCCESS)
    expect(newInstance.difficulty).toBeLessThan(testInstance.difficulty)
  })

  it('sets the next review day for tomorrow if you get it wrong', () => {
    const newInstance = updateInstanceStats(testInstance, MED_CONFIDENCE_FAILURE)
    const daysUntil = (newInstance.nextDate - NOW) / MS_IN_DAYS
    expect(daysUntil).toBeLessThan(2)
  })

  it('sets the next review day for a longer interval if you get it right', () => {
    const newInstance = updateInstanceStats(testInstance, HIGH_CONFIDENCE_SUCCESS)
    const daysUntil = (newInstance.nextDate - NOW) / MS_IN_DAYS
    expect(daysUntil).toBeGreaterThan(2)
  })
})

// needs to not break down when fed NaN difficulty of invalid date

// describe('driver robustness', () => {
//   it('handles one past occurance')
// })
