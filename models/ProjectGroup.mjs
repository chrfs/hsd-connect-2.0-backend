import mongoose from 'mongoose'
import { schemaUtils } from '../utils/models/schemaUtils'
import ProjectGroupMessage from './sub/ProjectGroupMessage'

const projectGroupSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projects',
    required: true
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Users',
    required: true,
    default: []
  },
  messages: {
    type: [ProjectGroupMessage],
    default: []
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

projectGroupSchema.pre('validate', schemaUtils.setPropertyDate('updatedAt'))

const ProjectGroup = mongoose.model('ProjectGroup', projectGroupSchema)

export default ProjectGroup
