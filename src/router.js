import { Router } from 'express'
import * as Cards from './controllers/card-controller'


const router = Router()

router.get('/', (req, res) => {
  Cards.getNextCard().then((card) => {
    res.json({
      message: 'SRS api',
      card,
    })
  })
})

// your routes will go here

export default router
