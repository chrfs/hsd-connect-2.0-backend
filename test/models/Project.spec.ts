import assert from 'assert';
import mongoose from 'mongoose';
import Project from '../../src/models/Project';
import mongoClient from '../../src/mongo';
import { ProjectInterface } from '../../src/types/Project';
import { createString } from '../utils/test';

const newProjectProperties = () => {
  return {
    user: new mongoose.Types.ObjectId(),
    title: `Test-${createString(40)}`,
    description: createString(500),
    likedBy: new Array(2).map(() => new mongoose.Types.ObjectId()),
    members: new Array(4).map(() => new mongoose.Types.ObjectId())
  };
};

const createProject = (projectProperties = newProjectProperties()): any => {
  return new Project(projectProperties as any).save();
};

before(async () => mongoClient.connect());
afterEach(async () => Project.deleteMany({}));
after(async () => mongoClient.disconnect());

describe('Project', function() {
  it('should save a new record', async () => {
    assert.equal((await createProject()).isNew, false);
  });

  it('should update a record property', async () => {
    const newProject: ProjectInterface = await createProject();
    newProject.searchingParticipants = false;
    assert.equal((await newProject.save()).searchingParticipants, false);
  });

  it('should throw an invalid title ValidationError', async () => {
    const newProject = await createProject();
    newProject.title = 'to short';
    // @ts-ignore
    await assert.rejects(newProject.save());
  });

  it('should throw an invalid description ValidationError', async () => {
    // @ts-ignore
    await assert.rejects(
      createProject({ ...newProjectProperties(), description: 'to short' })
    );
  });

  it('should throw a duplicate title ValidationError', async () => {
    const newProject = await createProject();
    // @ts-ignore
    await assert.rejects(
      createProject({ ...newProjectProperties(), title: newProject.title })
    );
  });
});
