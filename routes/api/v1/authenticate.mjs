import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import env from '../../../config/env'
import * as User from '../../../models/User'

const router = new Router({
  prefix: '/'
})

const checkUserPassword = async function (user, password) {
  try {
    if (!user) {
      return false
    }
    return bcrypt.compare(password, user.password)
  } catch (err) {
    throw err
  }
}

const createJWT = async function (user) {
  try {
    const newJwt = jwt.sign(
      { user: user.toObject() },
      env.JWT.SECRET,
      { expiresIn: env.JWT.EXPIRES_IN }
    )
    return newJwt
  } catch (err) {
    throw err
  }
}

router.post('users/auth', async ctx => {
  try {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to authenticate.'
      return
    }
    const user = await User.findUser({ email }).select('_id firstname lastname email password')
    const authStatus = await checkUserPassword(user, password)
    if (!authStatus) {
      ctx.body = 'Authentification failed, please check your credentials'
      ctx.status = 401
      return
    }
    user.password = null
    ctx.body = { authToken: await createJWT(user), user }
    ctx.state.isAuthorizing = true
  } catch (err) {
    throw err
  }
})

router.use(async (ctx, next) => {
  try {
    if (ctx.state.isisAuthorizing === true) {
      return
    }
    const authorization = jwt.verify(
      ctx.request.header.authorization,
      env.JWT.SECRET
    )
    if (!authorization) {
      ctx.status(401)
      return
    }
    ctx.state.user = authorization.user
    await next()
  } catch (err) {
    next(err)
  }
})

export default router
