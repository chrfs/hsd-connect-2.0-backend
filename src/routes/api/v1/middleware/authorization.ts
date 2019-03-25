import jwt from 'jsonwebtoken'
import env from '../../../../config/env'

export default async (ctx: any, next: any) => {
  try {
    const authToken = ctx.request.header.authorization
    if (!authToken) {
      ctx.status = 401
      return
    }
    const authorization: any = jwt.verify(
      ctx.request.header.authorization,
      env.JWT.SECRET
    )
    if (!authorization) {
      ctx.status = 401
      return
    }
    ctx.state.user = authorization.user
    await next()
  } catch (err) {
    ctx.status = 401
    throw err
  }
}
