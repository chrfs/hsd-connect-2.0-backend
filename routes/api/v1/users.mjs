import Router from 'koa-router'
import * as User from '../../../models/User'

const router = new Router({
  prefix: '/users'
})

router.get('/', async ctx => {
  const users = await User.findUsers({lean: true}).select('_id firstname lastname email')
  ctx.body = { users }
})

router.get('/:_id', async ctx => {
  const user = await User.findUser({ _id: ctx.params._id })
  ctx.body = { user }
})

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

export default router
