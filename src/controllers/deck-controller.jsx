import Card from '../models/card'


/** add new cards for deck */
export function createNewDeck(deck, deckName) {
  // check if deck already exists
  return Card.findOne({ deck: deckName }).then((card) => {
    if (card === null) {
      return Card.insertMany(deck)
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
export function deleteDeck(deckName) {
  return Card.deleteMany({ deck: deckName })
}
