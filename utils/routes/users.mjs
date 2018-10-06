import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../config/env.mjs'

export const checkUserPassword = async function (user, password) {
  try {
    const salt = await bcrypt.genSalt(env.BCRYPT.SALT_ROUNDS)
    const hashedPassword = bcrypt.hashSync(password, salt)
    return user.password === hashedPassword
  } catch (err) {
    throw err
  }
}

export const createJWT = async function (user) {
  try {
    const newJwt = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        authorization: user.authorization,
        settings: user.settings
      },
      env.JWT.SECRET,
      { expiresIn: env.JWT.EXPIRES_IN }
    )
    return newJwt
  } catch (err) {
    throw err
  }
}
