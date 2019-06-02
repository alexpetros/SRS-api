import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  decks: Array,
})

// make sure that the email is unique here

const userModel = mongoose.model('user', userSchema)

export default userModel
