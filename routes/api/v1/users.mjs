import Router from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../../config/env.mjs'
import * as User from '../../../models/User'

const router = new Router({
  prefix: '/users'
})

const checkUserPassword = async function (user, password) {
  try {
    const salt = await bcrypt.genSalt(env.BCRYPT.SALT_ROUNDS)
    const hashedPassword = bcrypt.hashSync(password, salt)
    return user.password === hashedPassword
  } catch (err) {
    throw err
  }
}

const createJWT = async function (user) {
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

router.get('/', async ctx => {
  const users = await User.findUsers()
  ctx.body = { users }
})

router.get('/:_id', async ctx => {
  const user = await User.findUser({ _id: ctx.params._id })
  ctx.body = { user }
})

router.post('/register', async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to register.'
      ctx.status = 401
      return
    }
    await User.createUser({ email, password })
    ctx.body = 'User has been successfully created.'
    ctx.status = 201
  } catch (err) {
    throw err
  }
})

router.post('/login', async ctx => {
  try {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.body = 'email and password are required'
      ctx.status = 406
      return
    }
    const user = await User.findUser({ email })
    const authStatus = checkUserPassword(user, password)
    if (!authStatus) {
      ctx.status = 401
      return
    }
    ctx.body = await createJWT(user)
  } catch (err) {
    throw err
  }
})

export default router
