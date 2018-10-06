import Router from 'koa-router'
import users from './users'
import projects from './projects'
import authorization from './middlewares/authorization.mjs'

const router = new Router()
router.all('/', (ctx, next) => {
  ctx.status = 200
  next()
})
router.use(users.routes())
router.use(authorization)
router.use(projects.routes())

export default router
