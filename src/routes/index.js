import { Router } from 'express'
import * as Cards from '../controllers/card-controller'
import * as Users from '../controllers/user-controller'

const router = Router()

/** add new user */
router.post('/', (req, res) => {
  const { username } = req.body

  Users.createNewUser(username)
    .then((user) => {
      res.json({ user })
    })
})

/** get user info */
router.get('/:user', (req, res) => {
  const { username } = req.body

  Users.getUser(username).then((user) => {
    res.json({ user })
  })
})

/** get next card for user */
router.get('/:user/card', (req, res) => {
  const username = req.params.user

  Cards.getNextCard(username).then((card) => {
    res.json({ card })
  })
})

router.get('/:user/card/:num', (req, res) => {
  const username = req.params.user
  const skip = Number(req.params.num)

  // the card we want will be the last in the array
  Cards.getXCardAfter(username, skip).then((card) => {
    res.json({ card })
  })
})

/** get random card for user */
router.get('/:user/random', (req, res) => {
  const username = req.params.user

  Cards.getRandomCard(username).then((card) => {
    res.json({ card })
  })
})

/** post response to card */
router.post('/:user/card', (req, res, next) => {
  const username = req.params.user
  const { cardId, performanceRating, dontUpdate } = req.body

  // allows client to send "dummy" responses
  if (dontUpdate) {
    res.sendStatus(200)
  } else {
    Cards.enterCardResponse(username, cardId, performanceRating)
      .then(() => {
        res.sendStatus(200)
      })
      .catch(next)
  }
})

/** create new deck of instances for user */
router.post('/:user/deck/:deckName', (req, res, next) => {
  const { user, deckName } = req.params

  Cards.startNewDeck(user, deckName)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

/** remove deck of instances from user */
router.delete('/:user/deck/:deckName', (req, res, next) => {
  const { user, deckName } = req.params

  Cards.deleteDeck(user, deckName)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

export default router
