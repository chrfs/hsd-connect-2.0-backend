import mongoose from 'mongoose'
import { projectValidatorErrors } from '../utils/models/projectUtils'
import {
  schemaUtils,
  schemaValidators,
  schemaValidatorMessages
} from '../utils/models/schemaUtils'

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
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
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Images'
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Users'
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Users'
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
projectSchema.pre('save', schemaValidators.validateLength('title', 25, 65))
projectSchema.pre(
  'save',
  schemaValidators.validateLength('description', 300, 1500)
)
projectSchema.pre(
  'save',
  schemaValidators.validateProperty(
    'title',
    async function (query) {
      return !(await Project.find(query)).length
    },
    projectValidatorErrors.uniqueTitle
  )
)
projectSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

const Project = mongoose.model('Project', projectSchema)

Project.createProject = projectProperties => {
  try {
    return new Project({
      user: projectProperties.user,
      title: projectProperties.title,
      description: projectProperties.description,
      images: projectProperties.images,
      searchingParticipants: projectProperties.searchingParticipants
    }).save()
  } catch (err) {
    throw err
  }
}

Project.findAndPopulate = (query = {}) => {
  return Project.find(query).populate({
    path: 'user',
    model: 'User',
    select: 'firstname lastname fullname'
  }).populate({
    path: 'images',
    model: 'Image',
    select: 'token -_id'
  })
}

export default Project
