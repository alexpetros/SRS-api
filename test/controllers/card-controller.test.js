import User from '../../src/models/user'
import Card from '../../src/models/card'
import Instance from '../../src/models/instance'

import * as Cards from '../../src/controllers/card-controller'

User.findOne = jest.fn()
// Instance.findOne = jest.fn()

// constants
const USERNAME = 'test_username'
const EMAIL = 'test_user@email.com'
const CARD_ID = '5c02af156271f4f70f0572c0'
const SUCCESS_RATING = .8

// fake user
const TEST_USER = {
  username: USERNAME,
  email: EMAIL,
  decks: []
}

describe('enterCardResponse', () => {
  it('searches for user based on username', () => {
    User.findOne.mockResolvedValue(TEST_USER)
    Cards.enterCardResponse(USERNAME, CARD_ID, SUCCESS_RATING)
    expect(User.findOne).toBeCalledWith({username: USERNAME})
  })

})
// handles empty db

// creates decks where no cards exists


