import mongoose from 'mongoose'
import { projectValidatorErrors } from '../utils/models/projectUtils'
import Image from './sub/Image'
import {
  schemaUtils,
  schemaValidators,
  schemaValidatorMessages
} from '../utils/models/schemaUtils'
import { ValidationError } from '../utils/errors'
import { parse } from '../utils/file'

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
    type: [Image],
    default: []
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
    default: false
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
projectSchema.pre('validate', schemaValidators.validateLength('title', 25, 65))
projectSchema.pre(
  'validate',
  schemaValidators.validateLength('description', 300, 1500)
)
projectSchema.pre(
  'validate',
  schemaValidators.validateProperty(
    'title',
    async function (query) {
      return !(await Project.find(query)).length
    },
    projectValidatorErrors.uniqueTitle
  )
)
projectSchema.pre('validate', schemaUtils.setPropertyDate('updatedAt'))
projectSchema.pre('validate', function (next) {
  this.images = Array.isArray(this.images) ? this.images : []
  if (this.images.length > 4) throw new ValidationError('images', 'The quantity of your images is too much.')
  this.images = this.images.filter(image => image.path)
  next()
})

projectSchema.pre('validate', function (next) {
  this.images = Array.isArray(this.images) ? this.images : []
  const isValid = parse.fileArrSize(this.images) <= 3e+6
  if (!isValid) {
    throw new ValidationError('images', `The total size of your images is to big! `)
  }
  next()
})

const Project = mongoose.model('Project', projectSchema)

Project.createProject = projectProperties => {
  try {
    return new Project({
      user: projectProperties.user,
      title: projectProperties.title,
      description: projectProperties.description,
      images: projectProperties.images,
      searchingParticipants: projectProperties.searchingParticipants
    })
  } catch (err) {
    throw err
  }
}

Project.updateProject = (project, projectProperties) => {
  try {
    project.title = projectProperties.title
    project.description = projectProperties.description
    project.images = projectProperties.images
    project.searchingParticipants = projectProperties.searchingParticipants
    return project
  } catch (err) {
    throw err
  }
}

export default Project
