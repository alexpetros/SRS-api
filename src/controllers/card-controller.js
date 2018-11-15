import Card from '../models/card'

export const getNextCard = (id) => {
  return Card.findOne({})
}

export const hasNextCard = () => {
  return true
}
