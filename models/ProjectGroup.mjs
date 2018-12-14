import mongoose from 'mongoose'
import { schemaUtils } from '../utils/models/schemaUtils'
import projectGroupMessageSchema from './sub/ProjectGroupMessage'

const projectGroupSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: true
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    required: true,
    default: []
  },
  messages: {
    type: [projectGroupMessageSchema],
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

projectGroupSchema.pre('save', schemaUtils.setPropertyDate('updatedAt'))

const ProjectGroup = mongoose.model('projectGroups', projectGroupSchema)

export default ProjectGroup
