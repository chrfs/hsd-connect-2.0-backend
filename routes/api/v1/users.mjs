import Router from 'koa-router'
import * as User from '../../../models/User'
import * as userHelper from '../../../utils/routes/users'

const router = new Router({
  prefix: '/users'
})

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
    const authStatus = userHelper.checkUserPassword(user, password)
    if (!authStatus) {
      ctx.status = 401
      return
    }
    ctx.body = await userHelper.createJWT(user)
  } catch (err) {
    throw err
  }
})

export default router
