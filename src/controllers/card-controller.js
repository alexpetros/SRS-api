import User from '../models/user'
import Card from '../models/card'
import Instance from '../models/instance'


function handleError(msg, statusCode) {
  const error = new Error(msg)
  error.statusCode = statusCode || 500
  throw error
}

function addDeckToUser(userId, deck) {
  return Card.find({ deck })
    .then((cards) => {
      const cardInstances = cards.map((card) => {
        const cardInstance = {
          userId,
          cardId: card._id,
          nextDate: new Date(),
          pastOccurances: [],
        }
        return cardInstance
      })
      Instance.insertMany(cardInstances)
    })
}

/**
 * get next card for the specified user
 * @param  {String} username
 * @return {Promise}    resolves to next card
 */
export const getNextCard = (username) => {
  return User.findOne({ username })
    .then((user) => {
      return Instance
        .findOne({
          $query: { userId: user._id },
          $orderby: { nextDate: -1 },
        })
    })
    .then((instance) => {
      console.log(instance)
      return Card.findById(instance.cardId)
    })
    .catch((err) => {
      handleError(err, 500)
    })
}

export const getRandomCard = (username) => {
  return Card
    .aggregate([{ $sample: { size: 1 } }])
    .then(cards => cards[0])
    .catch((err) => {
      handleError(err, 500)
    })
}

/**
 * copies all the cards from a deck into a user's instances
 * @param  {String} username
 * @param  {String} deck
 * @return {Promise}     resolves to true
 */
export const startNewDeck = (username, newDeck) => {
  // check that no cards from this newDeck exist
  return User.findOne({ username })
    .then((user) => {
      const { _id, decks } = user

      if (!decks.includes(newDeck)) {
        addDeckToUser(_id, newDeck)
          .then(() => {
            // previous operation has to succeed
            user.set({ decks: [...decks, newDeck] })
            user.save()
          })
      } else {
        handleError('user already has deck loaded', 400)
      }
    })
}
