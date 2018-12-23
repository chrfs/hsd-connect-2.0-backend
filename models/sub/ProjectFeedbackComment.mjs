import mongoose from 'mongoose'
import {
  schemaUtils,
  schemaValidators,
  schemaValidatorMessages
} from '../../utils/models/schemaUtils'

const projectFeedbackCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  content: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('comment content')]
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

projectFeedbackCommentSchema.pre(
  'validate',
  schemaValidators.validateLength('content', 5, 300)
)
projectFeedbackCommentSchema.pre(
  'validate',
  schemaUtils.setPropertyDate('updatedAt')
)

export default projectFeedbackCommentSchema
