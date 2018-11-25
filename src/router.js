import { Router } from 'express'
import * as Cards from './controllers/card-controller'
import * as Users from './controllers/user-controller'

const router = Router()

router.get('/', (req, res) => {
  Cards.getNextCard().then((card) => {
    res.json({
      message: 'SRS api',
      card,
    })
  })
})


router.post('/user', (req, res) => {
  const { email } = req.body

  Users.createNewUser(email).then((user) => {
    res.json({
      user,
    })
  })
})

export default router
