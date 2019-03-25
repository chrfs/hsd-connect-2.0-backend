import mongoose from 'mongoose'
import {
  schemaUtils,
  schemaValidator,
  schemaValidatorMessages
} from '../../utils/models/schemaUtils'

const projectGroupMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
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
  'validate',
  schemaValidator.validateLength('content', 2, 300)
)
projectGroupMessageSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

export default projectGroupMessageSchema
