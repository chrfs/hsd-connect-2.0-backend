import mongoose from 'mongoose'
import {
  schemaUtils,
  schemaValidators,
  schemaValidatorMessages
} from '../../utils/models/schemaUtils'

const projectGroupMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('message content')]
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

projectGroupMessageSchema.pre(
  'save',
  schemaValidators.validateLength('content', 2, 300)
)
projectGroupMessageSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

export default projectGroupMessageSchema
