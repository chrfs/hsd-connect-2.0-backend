import Router from 'koa-router'
import * as User from '../../../models/User'

const router = new Router({
  prefix: '/users'
})

router.get('/', async ctx => {
  const users = await User.getAllUsers()
  ctx.body = { users }
})

router.post('/register', async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to register.'
      ctx.status = 400
      return
    }
    await User.createUser({ email, password })
    ctx.body = 'User has been successfully created.'
  } catch (err) {
    next(err)
  }
})

export default router
