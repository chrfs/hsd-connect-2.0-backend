import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
import { schemaUtils } from '../utils/models/schemaUtils'

const imageSchema = new mongoose.Schema({
  path: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  token: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true
  },
  isActive: {
    type: mongoose.Schema.Types.Boolean,
    default: true
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

imageSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

imageSchema.pre('validate', function (next) {
  this.token = uuidv4()
  next()
})

const Image = mongoose.model('Image', imageSchema)

export default Image
