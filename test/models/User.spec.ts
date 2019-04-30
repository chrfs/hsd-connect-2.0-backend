import assert from 'assert';
import User from '../../src/models/User';
import mongoClient from '../../src/mongo';
import { userValidationErrors } from '../../src/utils/models/userUtils';
import { createString } from '../utils/test';

const newUserProperties = () => {
  return {
    email: `${createString(5)}.${createString(5)}@study.hs-duesseldorf.de`,
    password: '/38uwZ3z!Ue'
  };
};

const createUser = (userProperties = newUserProperties()) =>
  User.create(userProperties);

before(async () => mongoClient.connect());
afterEach(async () => User.deleteMany({}));
after(async () => mongoClient.disconnect());

describe('User', function() {
  it('should save a new record', async () => {
    assert.equal((await createUser()).isNew, false);
  });

  it('should update a record property', async () => {
    const newUser = await createUser();
    newUser.isVerified = true;
    assert.equal((await newUser.save()).isVerified, true);
  });

  it('should throw an invalid password ValidationError', async () => {
    const newUser = await createUser();
    newUser.password = '38uwZ3zUe';
    // @ts-ignore
    await assert.rejects(newUser.save(), userValidationErrors.invalidPassword);
  });

  it('should throw an invalid email ValidationError', async () => {
    // @ts-ignore
    await assert.rejects(
      createUser({
        ...newUserProperties(),
        email: 'not.valid@hs-duesseldorf.com'
      }),
      userValidationErrors.invalidEmail
    );
  });

  it('should throw a duplicate email ValidationError', async () => {
    const newUser = await createUser();
    // @ts-ignore
    await assert.rejects(
      createUser({ ...newUserProperties(), email: newUser.email }),
      userValidationErrors.uniqueEmail
    );
  });
});
