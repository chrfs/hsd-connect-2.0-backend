import { strict as assert} from 'assert'
import mongoClient from '../../mongo'
import User from './../../models/User'
import { userValidationErrors } from '../../utils/models/userUtils'
import { createString } from '../../utils/test'

const newUserProperties = () => {
  return {
    email: `${createString(5)}.${createString(5)}@study.hs-duesseldorf.de`,
    password: '/38uwZ3z!Ue'
  }
}

const createNewUser = (userProperties = newUserProperties()) => User.createUser(userProperties)

before(async () => mongoClient.connect())
afterEach(async () => User.deleteMany())
after(async () => mongoClient.disconnect())

describe('User', function () {
  it('should save a new record', async () => {
    assert.equal((await createNewUser()).isNew, false)
  })

  it('should update a record property', async () =>  {
    const newUser = await createNewUser()
    newUser.isVerified = true
    assert.equal((await newUser.save()).isVerified, true)
  })

  it('should throw an invalid password ValidationError', async () => {
    const newUser = await createNewUser()
    newUser.password = '38uwZ3zUe'
    await assert.rejects(newUser.save(), userValidationErrors.invalidPassword)
  })

  it('should throw an invalid email ValidationError', async () => {
    await assert.rejects(createNewUser({...newUserProperties(), email: 'not.valid@hs-duesseldorf.com'}), userValidationErrors.invalidEmail)
  })

  it('should throw a duplicate email ValidationError', async () => {
    const newUser = await createNewUser()
    await assert.rejects(createNewUser({...newUserProperties(), email: newUser.email}), userValidationErrors.uniqueEmail)
  })
})
