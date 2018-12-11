import { strict as assert} from 'assert'
import mongoose from 'mongoose';
import mongo from '../../mongo'
import { createString } from '../../utils/test'
import Project from '../../models/Project'
import { ValidationError } from '../../utils/errors'


const getProjectProperties = () => {
  return {
    userId: new mongoose.Types.ObjectId(),
    title: createString(30),
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

const createNewProject = (projectProperties = getProjectProperties()) => {
  return (new Project(projectProperties)).save()
}

before(async () => mongo.connect())
afterEach(async () => Project.deleteMany())
after(async () => mongo.disconnect())

describe('Project', function () {
  it('should save a new record', async () => {
    assert.equal((await createNewProject()).isNew, false)
  })

  it('should update a record property', async () =>  {
    const newProject = await createNewProject()
    newProject.searchingParticipants = false
    assert.equal((await newProject.save()).searchingParticipants, false)
  })

  it('should throw an invalid title ValidationError', async () => {
    const newProject = await createNewProject()
    newProject.title = 'to short'
    await assert.rejects(newProject.save())
  })

  it('should throw an invalid description ValidationError', async () => {
    await assert.rejects(createNewProject({...getProjectProperties(), description: 'to short'}))
  })

  it('should throw a duplicate title ValidationError', async () => {
    const newProject = await createNewProject()
    await assert.rejects(createNewProject({...getProjectProperties(), title: newProject.title}))
  })
})
