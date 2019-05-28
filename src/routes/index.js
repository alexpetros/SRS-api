import { Router } from 'express'
import fs from 'fs'
import multer from 'multer'
import csv from 'fast-csv'


import * as Cards from '../controllers/card-controller'
import * as Users from '../controllers/user-controller'
import * as Decks from '../controllers/deck-controller'

const router = Router()

/** add new user */
router.post('/', (req, res, next) => {
  const { username } = req.body

  Users.createNewUser(username)
    .then((user) => {
      res.json({ user })
    }).catch((err) => {
      // return 400 if duplicate
      if (err.code === 11000) {
        res.status(400).send({
          error: 'duplicate user',
        })
      // otherwise just send the full error to the client
      } else {
        next(err)
      }
    })
})

/** get user info */
router.get('/:user', (req, res, next) => {
  const username = req.params.user

  Users.getUser(username).then((user) => {
    if (user === null) {
      res.status(400).send({
        error: 'user does not exist',
      })
    } else {
      res.json({ user })
    }
  }).catch((err) => {
    next(err)
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

router.get('/:user/enableFetch', (req, res) => {
  const username = req.params.user

  Cards.checkForLearning(username).then((enableFetch) => {
    res.json({ enableFetch })
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



/** upload deck csv */
const upload = multer({ dest: 'tmp/' })
const type = upload.single('file')

router.post('/:user/newdeck/:deckname/csv', type, (req, res, next) => {
  const deckName = req.params.deckname

  // build rows as array
  const fileRows = []
  csv.fromPath(req.file.path).on('data', (data) => {
    fileRows.push(data)
  }).on('end', () => {
    // remove temp file
    fs.unlinkSync(req.file.path)

    // create an array of cards in proper format
    const deck = fileRows.map((row) => {
      return {
        content: row[0],
        answer: row[1],
        deck: deckName,
      }
    })

    Decks.createNewDeck(deck, deckName).then(() => {
      res.sendStatus(200)
    }).catch((err) => {
      // return 400 if the deck already exits
      if (err.code === 400) {
        res.status(400).send({
          error: err.message,
        })
      // otherwise just send the full error to the client
      } else {
        next(err)
      }
    })
  })
})

export default router
