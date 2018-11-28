// an "instance" of a card is a particular user's history with it
import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const instanceSchema = new Schema({
  userId: { type: ObjectId },
  cardId: ObjectId,
  difficulty: Number,
  nextDate: Date,
  pastOccurances: [Date],
})

instanceSchema.index({ userId: 1, nextDate: -1 })

const instanceModel = mongoose.model('instance', instanceSchema)

export default instanceModel
