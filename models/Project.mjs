import mongoose from 'mongoose'
import {schemaUtils} from '../utils/models'

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Please enter a proper title.'],
    unique: true,
    dropDups: true,
    validate: {
      validator: schemaUtils.validateLength(15, 30),
      message: 'The title length has to be between 15 and 30 characters.'
    }
  },
  description: {
    type: mongoose.Schema.Types.Array,
    validate: {
      validator: schemaUtils.validateLength(200, 1000),
      message:
        'The description length has to be between 200 and 1000 characters.'
    }
  },
  keywords: {
    type: mongoose.Schema.Types.Array
  },
  searching_participants: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  status: {
    type: mongoose.Schema.Types.String,
    required: true,
    values: ['getting started', 'w.i.p.', 'already finished']
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  updated_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

ProjectSchema.pre('update', schemaUtils.setRecordDate('updatedAt'))
ProjectSchema.path('title').validate(async function (title) {
  return !(await Project.find({ title })).length
}, 'A Project with this Title already exists.')
const Project = mongoose.model('projects', ProjectSchema)

export const findProjects = () => Project.find()

export const createProject = async newProject => {
  try {
    return new Project(newProject).save()
  } catch (err) {
    throw err
  }
}
export const updateProject = query => Project.update({ _id: query._id }, query)

export const findProject = query => Project.findOne(query)
