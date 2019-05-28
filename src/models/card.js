import mongoose, { Schema } from 'mongoose'

const cardSchema = new Schema({
  content: { type: String, required: true },
  answer: { type: String, required: true },
  deck: { type: String, required: true },
  deckUploader: { type: String, default: 'admin' },
  imageUrl: String,
  type: String,
  stack: String,
})

const cardModel = mongoose.model('card', cardSchema)

export default cardModel
