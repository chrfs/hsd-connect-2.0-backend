import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'

const imageSchema = new mongoose.Schema({
  path: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  token: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true
  }
})

imageSchema.pre('validate', function (next) {
  this.token = uuidv4()
  next()
})

const Image = mongoose.model('images', imageSchema)

export default Image
