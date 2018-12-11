import mongoose from 'mongoose'
import notificationSchema from './sub/Notification'
import {
  schemaValidators,
  schemaRecordUtils,
  schemaValidatorMessages
} from '../utils/models/schemaUtils'
import { userValidators, userRecordUtils, userValidationErrors } from '../utils/models/userUtils'

const userSchema = new mongoose.Schema({
  firstname: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('firstname')]
  },
  lastname: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('lastname')]
  },
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: [true, schemaValidatorMessages.isRequired('e-mail')]
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, schemaValidatorMessages.isRequired('password')]
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      language: 'de',
      receiveNotifications: true
    }
  },
  optionalInformation: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      major: '',
      expectedGraduation: {
        month: null,
        year: null
      }
    }
  },
  bookmarkedProjects: {
    type: mongoose.Schema.Types.Array,
    ref: 'projects'
  },
  authorization: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      isUser: true,
      isModerator: false,
      isSuperadmin: false
    }
  },
  notifications: {
    type: [notificationSchema],
    default: []
  },
  image: {
    type: [mongoose.Schema.Types.String],
    default: []
  },
  isActive: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  verificationCode: {
    type: mongoose.Schema.Types.String,
    default: ''
  },
  isVerified: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  }
})

userSchema.pre('validate', userRecordUtils.setNameOfEmail)
userSchema.pre('save', userValidators.validateEmail)
userSchema.pre('save', schemaValidators.validateProperty('email', async function (query) {
  return !(await User.find(query)).length
}, userValidationErrors.uniqueEmail))
userSchema.pre('save', userValidators.validatePassword)
userSchema.pre('save', userRecordUtils.setHashedPassword)
userSchema.pre('save', schemaRecordUtils.setPropertyDate('updatedAt'))

const User = mongoose.model('User', userSchema)

User.createUser = userProperties => {
  try {
    const { 
      firstname,
      lastname,
      email,
      password
    } = userProperties
    return (new User({
      firstname,
      lastname,
      email,
      password
    })).save()
  } catch (err) {
    throw err
  }
}

export default User
