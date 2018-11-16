import Card from '../models/card'

export const getNextCard = (id) => {
  return Card
    .aggregate([{ $sample: { size: 1 } }])
    .then(cards => cards[0])
}

export const hasNextCard = () => {
  return true
}
