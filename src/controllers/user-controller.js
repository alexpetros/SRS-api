import User from '../models/user'

function handleError(err) {
  console.log(err)
}

export const createNewUser = (username) => {
  const newUser = new User({ username })

  return newUser.save()
}

export const getUser = (username) => {
  return User.findOne({ username })
    .catch((err) => {
      handleError(err)
    })
}

