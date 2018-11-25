import User from '../models/user'

function handleError(err) {
  console.log(err)
}

export const createNewUser = (email) => {
  const newUser = new User({ email })

  return newUser.save()
    .catch((err) => {
      handleError(err)
    })
}

export const getUser = (email) => {
  return User.findOne({ email })
    .catch((err) => {
      handleError(err)
    })
}

