import Router from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../../config/env'
import { authorizeUser } from './middleware/authorization'
import * as User from '../../../models/User'

const router = new Router({
  prefix: '/users'
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
      { user: user },
      env.JWT.SECRET,
      { expiresIn: env.JWT.EXPIRES_IN }
    )
    return newJwt
  } catch (err) {
    throw err
  }
}

router.post('/', async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to register.'
      ctx.status = 401
      return
    }
    await User.createUser({ email, password })
    ctx.body = 'User has been successfully created.'
  } catch (err) {
    throw err
  }
})

router.post('/auth', async ctx => {
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
    return
  } catch (err) {
    throw err
  }
})

router.use(authorizeUser)

router.get('/', async ctx => {
  const users = await User.findUsers({lean: true}).select('_id firstname lastname email')
  ctx.body = { users }
})

router.get('/:_id', async ctx => {
  const user = await User.findUser({ _id: ctx.params._id })
  ctx.body = { user }
})

export default router
