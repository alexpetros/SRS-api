import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Type

const historySchema = new Schema({
  user_id: { type: ObjectId, index: true },
  card_id: ObjectId,
  next_date: Date,
})

const historyModel = mongoose.model('history', historySchema)

export default historyModel
