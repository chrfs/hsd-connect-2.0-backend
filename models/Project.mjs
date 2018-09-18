import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bitte gib einen aussagekräftigen Titel ein.']
  },
  text1: {
    type: String,
    required: [true, 'Bitte beschreibe dein Projektziel näher.']
  },
  text2: {
    type: String,
    required: [true, 'Bitte gib einen aussagekräftigen Titel ein.']
  },
  text3: {
    type: String,
    required: [true, 'Bitte gib einen aussagekräftigen Titel ein.']
  },
  keywords: {
    type: Array
  },
  team: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'Start'
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

const Project = mongoose.model('projects', projectSchema)

export const getAllProjects = () => Project.find()

export const createProject = async newProject => {
  try {
    const predefinedFields = {
      team: false,
      status: 'Start',
      created_at: Date.now()
    }
    return new Project(Object.assign(newProject, predefinedFields)).save()
  } catch (err) {
    throw err
  }
}

export const updateProject = projectQuery =>
  Project.update({ _id: projectQuery._id }, projectQuery)

export const findProjectByQuery = projectQuery => Project.find(projectQuery)
