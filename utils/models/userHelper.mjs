import bcrypt from 'bcrypt'
import env from '../../config/env.mjs'

export const validateEmail = mail => {
  const regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // eslint-disable-line
  const suffix = ['study.hs-duesseldorf.de']
  return (
    regExp.test(mail) &&
    suffix.some(suffix =>
      new RegExp(`${suffix}$`).test(mail.toLowerCase().replace(/\s/g, ''))
    )
  )
}

export const validatePassword = password => {
  const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,32})/
  return regExp.test(password)
}

export const setNameFromEmail = function (next) {
  const firstname = this.email
    .substring(0, this.email.indexOf('.'))
    .toLowerCase()
  this.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1)
  const lastname = this.email
    .substring(this.email.indexOf('.') + 1, this.email.indexOf('@'))
    .toLowerCase()
  this.lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1)
  next()
}

export const setHashedPassword = async function (next) {
  try {
    const salt = await bcrypt.genSalt(env.BCRYPT.SALT_ROUNDS)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
  } catch (err) {
    throw err
  }
}
