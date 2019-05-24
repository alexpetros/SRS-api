import User from '../models/user'

export const createNewUser = (username) => {
  const newUser = new User({ username })

  return newUser.save()
}

export const getUser = (username) => {
  return User.findOne({ username })
}

