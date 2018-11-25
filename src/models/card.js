import mongoose, { Schema } from 'mongoose'

const cardSchema = new Schema({
  content: { type: String, required: true },
  answer: { type: String, required: true },
  image_url: String,
  type: String,
  stack: String,
})

const cardModel = mongoose.model('card', cardSchema)

export default cardModel
