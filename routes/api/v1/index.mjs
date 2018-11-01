import Router from 'koa-router'
import users from './users'
import projects from './projects'

const router = new Router()

router.all('/', async (ctx, next) => {
  ctx.status = 200
  await next()
})

router.use(users.routes())
router.use(projects.routes())

export default router
