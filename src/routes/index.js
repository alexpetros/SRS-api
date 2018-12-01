import { Router } from 'express'
import * as Cards from '../controllers/card-controller'
import * as Users from '../controllers/user-controller'

const router = Router()

router.post('/', (req, res) => {
  const { username } = req.body

  Users.createNewUser(username)
    .then((user) => {
      res.json({ user })
    })
})

router.get('/:user', (req, res) => {
  const username = req.params.user

  Cards.getNextCard(username).then((card) => {
    res.json({ card })
  })
})

router.post('/:user/deck/:deckName', (req, res, next) => {
  const { user, deckName } = req.params

  Cards.startNewDeck(user, deckName)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

router.delete('/:user/deck/:deckName', (req, res, next) => {
  const { user, deckName } = req.params

  Cards.deleteDeck(user, deckName)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
})

export default router
