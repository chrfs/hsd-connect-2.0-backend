import mongoose from 'mongoose'
import {
  schemaUtils,
  schemaValidator,
  schemaValidatorMessages
} from '../utils/models/schemaUtils'
import ProjectFeedbackComment from './sub/ProjectFeedbackComment'

const projectFeedbackSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Projects'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Users'
  },
  content: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('feedback content')]
  },
  comments: {
    type: [ProjectFeedbackComment],
    default: []
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

projectFeedbackSchema.pre(
  'validate',
  schemaValidator.validateLength('content', 5, 300)
)
projectFeedbackSchema.pre('validate', schemaUtils.setPropertyDate('updatedAt'))

const ProjectFeedback = mongoose.model(
  'ProjectFeedback',
  projectFeedbackSchema
)

export default ProjectFeedback
