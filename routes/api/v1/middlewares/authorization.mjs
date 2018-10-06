import jwt from 'jsonwebtoken'
import env from '../../../../config/env'

export default (ctx, next) => {
  try {
    const authorization = jwt.verify(
      ctx.request.header.authorization,
      env.JWT.SECRET
    )
    if (!authorization) {
      ctx.status(401)
      return
    }
    next()
  } catch (err) {
    next(err)
  }
}
