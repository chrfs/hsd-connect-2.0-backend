import { strict as assert} from 'assert'
import mongoose from 'mongoose';
import mongoClient from '../../mongo'
import { createString } from '../../utils/test'
import Project from '../../models/Project'

const newProjectProperties = () => {
  return {
    user: new mongoose.Types.ObjectId(),
    title: createString(35),
    description: createString(500),
    likedBy: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    members: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ]
  }
}

const createProject = (projectProperties = newProjectProperties()) => {
  return (new Project(projectProperties)).save()
}

before(async () => mongoClient.connect())
afterEach(async () => Project.deleteMany())
after(async () => mongoClient.disconnect())

describe('Project', function () {
  it('should save a new record', async () => {
    assert.equal((await createProject()).isNew, false)
  })

  it('should update a record property', async () =>  {
    const newProject = await createProject()
    newProject.searchingParticipants = false
    assert.equal((await newProject.save()).searchingParticipants, false)
  })

  it('should throw an invalid title ValidationError', async () => {
    const newProject = await createProject()
    newProject.title = 'to short'
    await assert.rejects(newProject.save())
  })

  it('should throw an invalid description ValidationError', async () => {
    await assert.rejects(createProject({...newProjectProperties(), description: 'to short'}))
  })

  it('should throw a duplicate title ValidationError', async () => {
    const newProject = await createProject()
    await assert.rejects(createProject({...newProjectProperties(), title: newProject.title}))
  })
})
