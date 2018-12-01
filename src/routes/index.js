import { Router } from 'express'
import * as Cards from '../controllers/card-controller'
import * as Users from '../controllers/user-controller'

const router = Router()

// add new user
router.post('/', (req, res) => {
  const { username } = req.body

  Users.createNewUser(username)
    .then((user) => {
      res.json({ user })
    })
})

// get next card for user
router.get('/:user', (req, res) => {
  const username = req.params.user

  Cards.getNextCard(username).then((card) => {
    res.json({ card })
  })
})

// post response to card
router.post('/:user/card', (req, res, next) => {
  const username = req.params.user
  const { cardId, performanceRating } = req.body

  Cards.enterCardResponse(username, cardId, performanceRating)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

// create new deck of instances for user
router.post('/:user/deck/:deckName', (req, res, next) => {
  const { user, deckName } = req.params

  Cards.startNewDeck(user, deckName)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

// remove deck of instances from user
router.delete('/:user/deck/:deckName', (req, res, next) => {
  const { user, deckName } = req.params

  Cards.deleteDeck(user, deckName)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

export default router