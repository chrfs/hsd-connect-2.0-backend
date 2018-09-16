import jwt from 'jsonwebtoken'
import helpers from './helpers.js'
import env from '../../../config/env'

export default (ctx, next) => {
  try {
    const authorization = jwt.verify(ctx.header.authorization, env.JWT.SECRET)
    if (!authorization) {
      throw new Error()
    }
    next()
  } catch (err) {
    const error = {
      errors: {
        authorization: {
          message: 'Deine Session ist abgelaufen, bitte melde Dich wieder an.'
        }
      }
    }
    ctx.throw(
      401,
      'Unauthorized',
      JSON.stringify(helpers.formatResponse(error))
    )
  }
}
