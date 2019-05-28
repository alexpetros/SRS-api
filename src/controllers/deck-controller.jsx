import Card from '../models/card'
import { startNewDeck, getDeckCreator } from './card-controller'


/** add new cards for deck */
export function createNewDeck(user, deck, deckName) {
  // check if deck already exists
  return Card.findOne({ deck: deckName }).then((card) => {
    if (card === null) {
      // insert all the cards and start if for the user
      return Card.insertMany(deck).then(() => {
        return startNewDeck(user, deckName)
      })
    } else {
      const error = new Error('duplicate deck')
      error.code = 400
      throw error
    }
  })
}

/**
 * delete every card associated with a deck - use only be used in dev
 * would break users that subscribe to the deck
 */
export function deleteUserCreatedDeck(user, deckName) {
  getDeckCreator(deckName).then((deckCreator) => {
    if (user === deckCreator) {
      return Card.deleteMany({ deck: deckName })
    } else {
      return true
    }
  })
}
