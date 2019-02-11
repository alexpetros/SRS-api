// an "instance" of a card is a particular user's history with it
import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const ONE_DAY = 24 * 60 * 60 * 1000
const DEFAULT_DIFFICULTY = 0.3

const instanceSchema = new Schema({
  userId: { type: ObjectId },
  cardId: ObjectId,
  deck: String,
  difficulty: { type: Number, default: DEFAULT_DIFFICULTY },
  nextDate: { type: Date, default: new Date() },
  pastOccurances: { type: [Date], default: [] },
})

instanceSchema.virtual('isLearning').get(() => {
  const difference = new Date() - pastOccurances[0]
  return pastOccurances[0] === undefined || difference < ONE_DAY
})


instanceSchema.index({ userId: 1, nextDate: -1 })

const instanceModel = mongoose.model('instance', instanceSchema)

export default instanceModel
