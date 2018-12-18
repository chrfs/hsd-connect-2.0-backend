import { strict as assert} from 'assert'
import mongoose from 'mongoose';
import mongoClient from '../../mongo'
import { createString } from '../../utils/test'
import ProjectGroup from '../../models/ProjectGroup'

const newProjectGroupProperties = () => {
  return {
    project: new mongoose.Types.ObjectId(),
    members: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ]
  }
}

export const createProjectGroup = (projectGroupProperties = newProjectGroupProperties()) => {
  return (new ProjectGroup(projectGroupProperties)).save()
}

const newProjectGroupMessageProperties = () => {
  return {
    user: new mongoose.Types.ObjectId(),
    content: createString(30)
  }
}

before(async () => mongoClient.connect())
afterEach(async () => ProjectGroup.deleteMany())
after(async () => mongoClient.disconnect())

describe('ProjectGroup', function () {
  it('should save a new record', async () => {
    assert(await createProjectGroup())
  })

  describe('ProjectGroupMessage', function () {
    it('should save a new record', async () => {
      assert(await createProjectGroup({ ...newProjectGroupProperties(), messages: [newProjectGroupMessageProperties()]}))
    })
    
    it('should throw a type ValidationError', async () => {
      await assert.rejects(createProjectGroup({ ...newProjectGroupProperties(), messages: ''}))
    })
  })
})
