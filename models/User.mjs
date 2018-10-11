import mongoose from 'mongoose'
import {schemaUtils, userUtils} from '../utils/models'

const UserSchema = new mongoose.Schema({
  firstname: {
    type: mongoose.Schema.Types.String
  },
  lastname: {
    type: mongoose.Schema.Types.String
  },
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: [true, 'Please enter your hsd university e-mail address.'],
    validate: {
      validator: userUtils.validateEmail,
      message: 'Please use your hsd university e-mail address.'
    }
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Please enter a valid hsd university e-mail address.'],
    validate: {
      validator: userUtils.validatePassword,
      message: 'Your password has to contain an upper- & lowercase letter, a number, a special character (!@#%&) and have a length between 8 and 32 characters.'
    }
  },
  settings: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  authorization: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  active: {
    type: mongoose.Schema.Types.Boolean,
    default: true
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

UserSchema.pre('save', userUtils.setRecordNameOfEmail)
UserSchema.pre('save', userUtils.setRecordHashedPassword)
UserSchema.pre('save', schemaUtils.setRecordDate('updatedAt'))
UserSchema.path('email').validate(async function (email) {
  return !(await User.find({ email })).length
}, 'An user with this e-mail already exists.')

const User = mongoose.model('users', UserSchema)
export const findUsers = () => User.find()

export const createUser = userProperties => {
  try {
    const predefinedFields = {
      settings: 0,
      authorization: 0,
      active: true,
      created_at: Date.now()
    }
    const newUser = new User({...userProperties, ...predefinedFields})
    return newUser.save()
  } catch (err) {
    throw err
  }
}

export const updateUser = query => User.update({ _id: query._id }, query)

export const findUser = query => User.findOne(query)
