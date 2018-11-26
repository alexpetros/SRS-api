import User from '../models/user'

function handleError(err) {
  console.log(err)
}

export const createNewUser = (username) => {
  const newUser = new User({ username })

  return newUser.save()
    .catch((err) => {
      handleError(err)
    })
}

export const getUser = (username) => {
  return User.findOne({ username })
    .catch((err) => {
      handleError(err)
    })
}

