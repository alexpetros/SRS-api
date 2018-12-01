import User from '../models/user'
import Card from '../models/card'
import Instance from '../models/instance'

import { updateInstanceStats } from '../srs'

function handleError(msg, statusCode) {
  const error = new Error(msg)
  error.statusCode = statusCode || 500
  throw error
}

/**
 * create an instance of each card attached to the user
 * start with 5 new cards a day
 *
 * @param {[type]} userId [description]
 * @param {[type]} deck   [description]
 */
function addDeckToUser(userId, deck) {
  return Card.find({ deck })
    .then((cards) => {
      let count = 0
      let dateIterator = 0

      const cardInstances = cards.map((card) => {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + dateIterator)

        const cardInstance = {
          userId,
          deck,
          cardId: card._id,
          nextDate: new Date(),
          pastOccurances: [],
        }

        // increment date and reset count after 5 cards
        count += 1
        if (count === 5) {
          count = 0
          dateIterator += 1
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
export function getNextCard(username) {
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


export function enterCardResponse(username, cardId, performanceRating) {
  return User.findOne({ username })
    .then((user) => {
      Instance.findOne({ userId: user._id, cardId })
        .then((instance) => {
          const newInstance = updateInstanceStats(instance, performanceRating)
          const { difficulty, nextDate, pastOccurances } = newInstance

          instance.set({
            difficulty,
            nextDate,
            pastOccurances,
          })
          instance.save()
        })
    })
}

/**
 * copies all the cards from a deck into a user's instances
 * @param  {String} username
 * @param  {String} deck
 * @return {Promise}     resolves to true
 */
export function startNewDeck(username, newDeck) {
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

export function deleteDeck(username, deck) {
  return User.findOne({ username })
    .then((user) => {
      const { _id, decks } = user

      if (decks.includes(deck)) {
        Instance.deleteMany({ userId: _id, deck })
          .then(() => {
            // previous operation has to succeed, then slice the name out
            const index = decks.indexOf(deck)
            user.set({ decks: [...decks.slice(0, index), ...decks.slice(index + 1)] })
            user.save()
          })
      } else {
        handleError('user does not have deck loaded', 400)
      }
    })
}
