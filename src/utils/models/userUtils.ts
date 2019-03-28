import bcrypt from 'bcrypt'
import env from '../../config/env'
import { ValidationError } from '../errors'

export const userValidator = {
  validateEmail: function (next: any) {
    if (!this.isNew && !this.isModified('email')) return next()

    const regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // eslint-disable-line
    const suffix = ['@study.hs-duesseldorf.de']
    const isValid =
      regExp.test(this.email) && suffix.some(suffix => new RegExp(`${suffix}$`).test(this.email.toLowerCase().replace(/\s/g, '')))
    if (!isValid) throw userValidationErrors.invalidEmail
    this.email = this.email.toLowerCase()
    return next()
  },
  validatePassword: function (next: any) {
    try {
      if (!this.isNew && !this.isModified('password')) return next()
      const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,32})/
      const isValid = regExp.test(this.password) && this.password.length >= 8 && this.password.length <= 32
      if (!isValid) throw userValidationErrors.invalidPassword
      return next()
    } catch (err) {
      throw err
    }
  }
}

export const userRecordUtils = {
  setNameOfEmail (next: any) {
    if (!this.isNew && !this.isModified('email')) return next()
    if (!this.email) {
      throw userValidationErrors.invalidEmail
    }
    const emailPrefix = this.email.substring(0, this.email.indexOf('@'))
    const emailPrefixSplitted = emailPrefix.split('.')

    if (!emailPrefix.includes('.') || emailPrefixSplitted.length !== 2) {
      throw userValidationErrors.invalidEmail
    }

    this.firstname = emailPrefixSplitted[0]
    this.lastname = emailPrefixSplitted[1]
    this.firstname = this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1)
    this.lastname = this.lastname.charAt(0).toUpperCase() + this.lastname.slice(1)
    if (!this.firstname || !this.lastname) {
      throw userValidationErrors.invalidEmail
    }
    return next()
  },
  setHashedPassword: async function (next: any) {
    try {
      if (!this.isNew && !this.isModified('password')) return next()
      const salt = await bcrypt.genSalt(env.BCRYPT.SALT_ROUNDS)
      this.password = bcrypt.hashSync(this.password, salt)
      next()
    } catch (err) {
      throw err
    }
  }
}

export const userValidationErrors = {
  invalidPassword: ValidationError(
    'password',
    'Your password has to contain an upper- & lowercase letter, a number, a special character (!@#%&) and have a length between 8 and 32 characters.'
  ),
  invalidEmail: ValidationError('email', 'Please use your hsd university e-mail address.'),
  uniqueEmail: ValidationError('email', 'An user with this e-mail already exists.')
}
