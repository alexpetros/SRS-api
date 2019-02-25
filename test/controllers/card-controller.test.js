import User from '../../src/models/user'
import Card from '../../src/models/card'
import Instance from '../../src/models/instance'

import * as Cards from '../../src/controllers/card-controller'
import * as sm2 from '../../src/srs/sm2-driver'
import * as initial from '../../src/srs/initial-learning-driver'


// constants
const USERNAME = 'test_username'
const EMAIL = 'test_user@email.com'
const SUCCESS_RATING = .8
const USER_ID = 1
const CARD_ID = '5c02af156271f4f70f0572c0'
const DEFAULT_DIFFICULTY = 0.3

// default dates
const NOW = new Date()
const YESTERDAY = new Date(NOW)
YESTERDAY.setDate(NOW.getDate() - 1)
const TWO_DAYS_AGO = new Date(NOW)
TWO_DAYS_AGO.setDate(NOW.getDate() - 2)
const ONE_PAST_OCCURANCE = [TWO_DAYS_AGO]



const TEST_USER = {
  _id: USER_ID,
  username: USERNAME,
  email: EMAIL,
  decks: []
}

const TEST_INSTANCE = {
  userId: USER_ID,
  cardId: CARD_ID,
  difficulty: DEFAULT_DIFFICULTY,
  nextDate: NOW,
  pastOccurances: ONE_PAST_OCCURANCE,
  learningCount: -1
}


describe.only('enterCardResponse', () => {
  beforeEach(() => {
    User.findOne = jest.fn()
    Instance.findOne = jest.fn()
    TEST_INSTANCE.set = jest.fn()
    TEST_INSTANCE.save= jest.fn()

    User.findOne.mockResolvedValue(TEST_USER)
    Instance.findOne.mockResolvedValue(TEST_INSTANCE)
  })

  it('gets correct card instance using username lookup', (done) => {
    Cards.enterCardResponse(USERNAME, CARD_ID, SUCCESS_RATING).then(() => {
      expect(User.findOne).toBeCalledWith({username: USERNAME})
      expect(Instance.findOne).toBeCalledWith({userId: USER_ID, cardId:CARD_ID})
      done()
    })
  })

  // note that this test relies on the isLearning property
  // it doesn't check that the virtual schema is working properly
  it('calls learning driver when starting learning phase', (done) => {
    initial.updateInstanceStats = jest.fn()
    initial.updateInstanceStats.mockResolvedValue({difficulty: 1})

    TEST_INSTANCE.learningCount = 0
    Cards.enterCardResponse(USERNAME, CARD_ID, SUCCESS_RATING).then(() => {
      expect(initial.updateInstanceStats).toBeCalled()
      done()
    })
  })

  it('calls learning driver while in learning phase', (done) => {
    initial.updateInstanceStats = jest.fn()
    initial.updateInstanceStats.mockResolvedValue({difficulty: 1})

    TEST_INSTANCE.learningCount = 3
    Cards.enterCardResponse(USERNAME, CARD_ID, SUCCESS_RATING).then(() => {
      expect(initial.updateInstanceStats).toBeCalled()
      done()
    })
  })

  it('calls sm2 driver when not in learning phase', (done) => {
    sm2.updateInstanceStats = jest.fn()
    sm2.updateInstanceStats.mockResolvedValue({difficulty: 1})

    TEST_INSTANCE.learningCount = -1
    Cards.enterCardResponse(USERNAME, CARD_ID, SUCCESS_RATING).then(() => {
      expect(sm2.updateInstanceStats).toBeCalled()
      done()
    })
  })
})
// handles empty db

// creates decks where no cards exists


