import mongoose from 'mongoose'
import { projectValidatorErrors } from '../utils/models/projectUtils'
import projectFeedbackSchema from './ProjectFeedback'
import {
  schemaUtils,
  schemaValidators,
  schemaValidatorMessages
} from '../utils/models/schemaUtils'

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('title')]
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('description')]
  },
  images: {
    type: [mongoose.Schema.Types.String],
    default: []
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'users'
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'users'
  },
  searchingParticipants: {
    type: mongoose.Schema.Types.Boolean,
    default: true
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
projectSchema.pre('save', schemaValidators.validateLength('title', 20, 35))
projectSchema.pre('save', schemaValidators.validateLength('description', 300, 1500))
projectSchema.pre('save', schemaValidators.validateProperty('title', async function (query) {
  return !(await Project.find(query)).length
}, projectValidatorErrors.uniqueTitle))
projectSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

const Project = mongoose.model('projects', projectSchema)

Project.createProject = projectProperties => {
  try {
    return (new Project({
      userId: projectProperties.userId,
      title: projectProperties.title,
      description: projectProperties.description,
      images: projectProperties.images,
      searchingParticipants: projectProperties.searchingParticipants
    })).save()
  } catch (err) {
    throw err
  }
}

export default Project
