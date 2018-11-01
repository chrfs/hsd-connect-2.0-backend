import Router from 'koa-router'
import users from './users'
import projects from './projects'
import authenticate from './authenticate.mjs'

const router = new Router()
router.all('/', async (ctx, next) => {
  ctx.status = 200
  await next()
})
router.use(authenticate.routes())
router.use(users.routes())
router.use(projects.routes())

export default router
