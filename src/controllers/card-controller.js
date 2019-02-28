import User from '../models/user'
import Card from '../models/card'
import Instance from '../models/instance'

import * as sm2 from '../srs/sm2-driver'
import * as initial from '../srs/initial-learning-driver'

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
          nextDate: startDate,
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
        .findOne({ userId: user._id })
        .sort({ nextDate: 1 })
    })
    .then((instance) => {
      if (instance.nextDate > new Date()) {
        return null
      } else {
        return Card.findById(instance.cardId)
      }
    })
    .catch((err) => {
      handleError(err, 500)
    })
}

/**
 * get the nth card up
 * @param  {String} username
 * @param  {Number} limit
 * @return {Array[String]}          list of cards
 */
export function getXCardAfter(username, limit) {
  return User.findOne({ username })
    .then((user) => {
      return Instance
        .find({ userId: user._id })
        .sort({ nextDate: 1 })
        .limit(limit)
    })
    .then((instances) => {
      const instance = instances[instances.length - 1]
      const { cardId, nextDate } = instance

      if (nextDate > new Date() || instances.length === 1) {
        return null
      } else {
        return Card.findById(cardId)
      }
    })
}

/**
 * get a random card from the user's instances
 * @param  {String} username
 * @return {Promise}          resolves to random card
 */
export const getRandomCard = (username) => {
  return User.findOne({ username })
    .then((user) => {
      return Instance
        .aggregate([{ $sample: { size: 1 } }])
        .then(cards => cards[0])
        .catch((err) => {
          handleError(err, 500)
        })
    })
    .then((instance) => {
      return Card.findById(instance.cardId)
    })
}

/**
 * log a user's response to seeing a card
 * @param  {String} username
 * @param  {String} cardId
 * @param  {Number} performanceRating
 * @return {Promise}                   resolve to true if successful
 */
export function enterCardResponse(username, cardId, performanceRating) {
  return User.findOne({ username })
    .then((user) => {
      Instance.findOne({ userId: user._id, cardId })
        .then((instance) => {
          // choose the correct driver based on whether we're in the learning phase
          const driver = instance.learningCount >= 0 ? initial : sm2
          const newInstance = driver.updateInstanceStats(instance, performanceRating)
          const { difficulty, nextDate, pastOccurances, learningCount } = newInstance

          // save the new properties to the old instance
          instance.set({
            difficulty,
            nextDate,
            pastOccurances,
            learningCount,
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

/** check if given user is still in learning phase */
export function checkForLearning(username) {
  return User.findOne({ username })
    .then((user) => {
      // check if any due within next hour have learning phase on
      const nextHour = new Date()
      nextHour.setHours(nextHour.getHours() + 1)

      return Instance
        .find({ nextDate: { $lt: nextHour }, learningCount: { $gt: -1 } })
        .then((cards) => {
          // console.log(`learning phase cards due in the next hour are: ${cards}`)
          return cards.length > 0
        })
        .catch((err) => {
          handleError(err, 500)
        })
    })
}
