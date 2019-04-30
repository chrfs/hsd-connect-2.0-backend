import assert from 'assert';
import mongoose from 'mongoose';
import ProjectFeedback from '../../src/models/ProjectFeedback';
import mongoClient from '../../src/mongo';
import { createString } from '../utils/test';

const newProjectFeedbackProperties = (): any => {
  return {
    user: new mongoose.Types.ObjectId(),
    project: new mongoose.Types.ObjectId(),
    likedBy: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    content: createString(30)
  };
};

export const createProjectFeedback = (
  projectFeedbackProperties = newProjectFeedbackProperties()
) => {
  return new ProjectFeedback(projectFeedbackProperties);
};

const newProjectFeedbackCommentProperties = () => {
  return {
    user: new mongoose.Types.ObjectId(),
    content: createString(30)
  };
};

before(async () => mongoClient.connect());
afterEach(async () => ProjectFeedback.deleteMany({}));
after(async () => mongoClient.disconnect());

describe('ProjectFeedback', function() {
  it('should save a new record', async () => {
    assert(await createProjectFeedback().save());
  });

  it('should throw an invalid content ValidatorError', async () => {
    // @ts-ignore
    await assert.rejects(
      createProjectFeedback({
        ...newProjectFeedbackProperties(),
        content: 'ts'
      }).validate()
    );
  });

  describe('ProjectFeedbackComment', function() {
    it('should save a new record', async () => {
      // @ts-ignore
      assert(
        await createProjectFeedback({
          ...newProjectFeedbackProperties(),
          comments: [newProjectFeedbackCommentProperties()]
        }).save()
      );
    });

    it('should throw a comment type error', async () => {
      // @ts-ignore
      await assert.rejects(
        createProjectFeedback({
          ...newProjectFeedbackProperties(),
          comments: ''
        }).validate()
      );
    });

    it('should throw a invalid content ValidationError', async () => {
      // @ts-ignore
      await assert.rejects(
        createProjectFeedback({
          ...newProjectFeedbackProperties(),
          comments: [
            { ...newProjectFeedbackCommentProperties(), content: 'ts' }
          ]
        }).save()
      );
    });
  });
});
