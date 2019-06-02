import User from '../models/user'
import { startNewDeck } from './card-controller'

const DEFAULT_DECK = 'french-art'

export const createNewUser = (username, password) => {
  const newUser = new User({ username, password })

  return newUser.save().then((user) => {
    return startNewDeck(user.username, DEFAULT_DECK)
  })
}

export const getUser = (username) => {
  return User.findOne({ username })
}

