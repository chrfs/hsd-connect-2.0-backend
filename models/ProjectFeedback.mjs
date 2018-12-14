import mongoose from 'mongoose'
import { schemaUtils, schemaValidators, schemaValidatorMessages } from '../utils/models/schemaUtils'
import projectFeedbackCommentSchema from './sub/ProjectFeedbackComment'

const projectFeedbackSchema  = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'projects'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'users'
  },
  content: {
    type: mongoose.Schema.Types.String,
    required: [true,  schemaValidatorMessages.isRequired('feedback content')]
  },
  comments: {
    type: [projectFeedbackCommentSchema],
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

projectFeedbackSchema.pre('save', schemaValidators.validateLength('content', 5, 300))
projectFeedbackSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

const ProjectFeedback = mongoose.model('projectFeedbacks', projectFeedbackSchema)

export default ProjectFeedback
