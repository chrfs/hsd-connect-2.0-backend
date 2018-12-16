import KoaRouter from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../../config/env'
import authorization from './middleware/authorization'
import User from '../../../models/User'

const router = new KoaRouter({
  prefix: '/users'
})

const authenticateUser = function (password, user) {
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
    const newJWT = jwt.sign({ user: user }, env.JWT.SECRET, {
      expiresIn: env.JWT.EXPIRES_IN
    })
    return newJWT
  } catch (err) {
    throw err
  }
}

router.post('/', async (ctx) => {
  try {
    const { email, password } = ctx.request.fields
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
    const { email, password } = ctx.request.fields
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to authenticate.'
      return
    }
    const user = await User.findOne({ email }).select(
      '_id firstname lastname email password'
    )
    const authStatus = await authenticateUser(password, user)
    if (!authStatus) {
      ctx.body = 'Authentification failed, please check your credentials'
      ctx.status = 401
      return
    }
    const {password: removed, ...userRest} = user.toObject()
    ctx.body = { authToken: await createJWT(userRest), user: userRest }
    return
  } catch (err) {
    throw err
  }
})

router.use(authorization)

router.get('/', async ctx => {
  const users = await User.find({ lean: true }).select(
    '_id firstname lastname email'
  )
  ctx.body = { users }
})

router.get('/:_id', async ctx => {
  const user = await User.find({ _id: ctx.params._id })
  ctx.body = { user }
})

export default router
