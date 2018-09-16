import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import env from '../config/env.mjs'

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
      validator: userMail =>
        mailValidation.regExp.test(userMail) &&
        mailValidation.suffix.some(suffix =>
          new RegExp(`${suffix}$`).test(
            userMail.toLowerCase().replace(/\s/g, '')
          )
        ),
      message: 'Bitte verwende Deine gültige HSD E-Mail Adresse.'
    }
  },
  password: {
    type: String,
    required: [true, 'Bitte gebe ein gültiges Passwort ein.'],
    validate: {
      validator: userPassword => passwordValidation.regExp.test(userPassword),
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

async function hashPassword () {
  try {
    const bcryptConfig = env.BCRYPT
    const salt = await bcrypt.genSalt(bcryptConfig.SALT_ROUNDS)
    this.password = bcrypt.hashSync(this.password, salt)
  } catch (err) {
    throw err
  }
}

function setName () {
  const firstname = this.email
    .substring(0, this.email.indexOf('.'))
    .toLowerCase()
  this.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1)
  const lastname = this.email
    .substring(this.email.indexOf('.') + 1, this.email.indexOf('@'))
    .toLowerCase()
  this.lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1)
}

userSchema.pre('save', hashPassword)
userSchema.pre('save', setName)

const User = mongoose.model('users', userSchema)

const predefinedFields = {
  settings: 0,
  authorization: 0,
  active: true,
  created_at: Date.now()
}
export const createUser = async newUser => {
  try {
    const emailIsUnique = !(await User.find({ email: newUser.email })).length
    if (!emailIsUnique) {
      throw new Error({
        errors: {
          email: {
            message:
              'Unter der angegebenen E-Mail Adresse existiert bereits ein Zugang.'
          }
        }
      })
    }

    return new User(Object.assign(newUser, predefinedFields)).save()
  } catch (err) {
    throw err
  }
}
export const updateUser = userQuery =>
  User.update({ _id: userQuery._id }, userQuery)

export const findUser = userQuery => User.find(userQuery)
