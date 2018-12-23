import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
import { schemaValidators } from '../../utils/models/schemaUtils'

const imageSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: false
  },
  path: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  token: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  size: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  mime: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  orderNo: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  },
  isActive: {
    type: mongoose.Schema.Types.Boolean,
    default: true
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

imageSchema.pre('validate', schemaValidators.validateLength('name', 5, 22))
imageSchema.pre('validate', function (next) {
  this.token = uuidv4()
  next()
})

export default imageSchema
