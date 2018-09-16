import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import env from '../config/env.mjs'
import * as userValidator from '../utils/validators/user'

const mailValidation = {
  regExp: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, // eslint-disable-line
  suffix: ['study.hs-duesseldorf.de']
}

const passwordValidation = {
  regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,32})/
}

const userSchema = new mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Bitte verwende Deine gültige HSD E-Mail Adresse.'],
    validate: {
      validator: userValidator.validateEmail,
      message: 'Bitte verwende Deine gültige HSD E-Mail Adresse.'
    }
  },
  password: {
    type: String,
    required: [true, 'Bitte gebe ein gültiges Passwort ein.'],
    validate: {
      validator: userValidator.validatePassword,
      message:
        'Dein Passwort muss aus einem Klein- & Großbuchstaben, einer Zahl, einem Sonderzeichen (!@#%&) bestehen und zwischen acht bis 32 Zeichen lang sein.'
    }
  },
  settings: {
    type: Number,
    default: 0
  },
  authorization: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

const setNameFromEmail = function () {
  const firstname = this.email.substring(0, this.email.indexOf('.')).toLowerCase()
  this.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1)
  const lastname = this.email.substring(this.email.indexOf('.') + 1, this.email.indexOf('@')).toLowerCase()
  this.lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1)
}

const setHashedPassword = async function () {
  try {
    const salt = await bcrypt.genSalt(env.BCRYPT.SALT_ROUNDS)
    this.password = bcrypt.hashSync(this.password, salt)
  } catch (err) {
    throw err
  }
}

userSchema.pre('save', setNameFromEmail)
userSchema.pre('save', setHashedPassword)

const User = mongoose.model('users', userSchema)


export const getAllUsers = () => User.find()

export const createUser = async newUser => {
  try {
    const emailIsUnique = !(await User.find({ email: newUser.email })).length
    if (!emailIsUnique) {
      throw new Error({email:'Unter der angegebenen E-Mail Adresse existiert bereits ein Zugang.'})
    }
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

export const updateUser = userQuery =>
  User.update({ _id: userQuery._id }, userQuery)

export const findUserByQuery = userQuery => User.find(userQuery)
