import mongoose from 'mongoose'
import * as schemaHelper from '../utils/models/schema'
import * as userHelper from '../utils/models/user'

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
    required: [true, 'Bitte verwende Deine gültige HSD E-Mail Adresse.'],
    validate: {
      validator: userHelper.validateEmail,
      message: 'Bitte verwende Deine gültige HSD E-Mail Adresse.'
    }
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Bitte gebe ein gültiges Passwort ein.'],
    validate: {
      validator: userHelper.validatePassword,
      message:
        'Dein Passwort muss aus einem Klein- & Großbuchstaben, einer Zahl, einem Sonderzeichen (!@#%&) bestehen und zwischen acht bis 32 Zeichen lang sein.'
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

UserSchema.pre('save', userHelper.setNameFromEmail)
UserSchema.pre('save', userHelper.setHashedPassword)
UserSchema.pre('save', schemaHelper.setDate('updatedAt'))
UserSchema.path('email').validate(async function (email) {
  return !(await User.find({ email: email })).length
}, 'An User with this E-Mail already exists.')

const User = mongoose.model('users', UserSchema)
export const findUsers = () => User.find()

export const createUser = async newUser => {
  try {
    const predefinedFields = {
      settings: 0,
      authorization: 0,
      active: true,
      created_at: Date.now()
    }
    return new User(Object.assign(newUser, predefinedFields)).save()
  } catch (err) {
    throw err
  }
}

export const updateUser = query => User.update({ _id: query._id }, query)

export const findUser = query => User.findOne(query)
