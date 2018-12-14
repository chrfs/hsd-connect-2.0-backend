import { strict as assert} from 'assert'
import mongoose from 'mongoose';
import mongoClient from '../../mongo'
import { createString } from '../../utils/test'
import ProjectFeedback from '../../models/ProjectFeedback'

const newProjectFeedbackProperties = () => {
  return {
    userId: new mongoose.Types.ObjectId(),
    projectId: new mongoose.Types.ObjectId(),
    likedBy: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    content: createString(30)
  }
}

export const createNewProjectFeedback = (projectFeedbackProperties = newProjectFeedbackProperties()) => {
  return (new ProjectFeedback(projectFeedbackProperties)).save()
}

const newProjectFeedbackCommentProperties = () => {
  return {
    userId: new mongoose.Types.ObjectId(),
    content: createString(30)
  }
}

before(async () => mongoClient.connect())
afterEach(async () => ProjectFeedback.deleteMany())
after(async () => mongoClient.disconnect())

describe('ProjectFeedback', function () {
  it('should save a new record', async () => {
    assert(await createNewProjectFeedback())
  })

  it('should throw an invalid content ValidatorError', async () => {
    await assert.rejects(createNewProjectFeedback({...newProjectFeedbackProperties(), content: 'ts'}))
  })

  describe('ProjectFeedbackComment', function () {
    it('should save a new record', async () => {
      assert(await createNewProjectFeedback({ ...newProjectFeedbackProperties(), comments: [newProjectFeedbackCommentProperties()]}))
    })
    
    it('should throw a type ValidationError', async () => {
      await assert.rejects(createNewProjectFeedback({ ...newProjectFeedbackProperties(), comments: ''}))
    })
  })
})
