import { strict as assert} from 'assert'
import mongoose from 'mongoose';
import mongoClient from '../../mongo'
import { createString } from '../../utils/test'
import ProjectFeedback from '../../models/ProjectFeedback'

const newProjectFeedbackProperties = () => {
  return {
    user: new mongoose.Types.ObjectId(),
    project: new mongoose.Types.ObjectId(),
    likedBy: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    content: createString(30)
  }
}

export const createProjectFeedback = (projectFeedbackProperties = newProjectFeedbackProperties()) => {
  return (new ProjectFeedback(projectFeedbackProperties)).save()
}

const newProjectFeedbackCommentProperties = () => {
  return {
    user: new mongoose.Types.ObjectId(),
    content: createString(30)
  }
}

before(async () => mongoClient.connect())
afterEach(async () => ProjectFeedback.deleteMany())
after(async () => mongoClient.disconnect())

describe('ProjectFeedback', function () {
  it('should save a new record', async () => {
    assert(await createProjectFeedback())
  })

  it('should throw an invalid content ValidatorError', async () => {
    await assert.rejects(createProjectFeedback({...newProjectFeedbackProperties(), content: 'ts'}))
  })

  describe('ProjectFeedbackComment', function () {
    it('should save a new record', async () => {
      assert(await createProjectFeedback({ ...newProjectFeedbackProperties(), comments: [newProjectFeedbackCommentProperties()]}))
    })
    
    it('should throw a comment type error', async () => {
      await assert.rejects(createProjectFeedback({ ...newProjectFeedbackProperties(), comments: ''}))
    })
    it('should throw a invalid content ValidationError', async () => {
      await assert.rejects(createProjectFeedback({ ...newProjectFeedbackProperties(), comments: [{...newProjectFeedbackCommentProperties(), content: 'ts'}]}))
    })
  })
})
