import Router from 'koa-router'
import users from './users'
import projects from './projects'

const router = new Router()
router.use(users.routes())
router.use(projects.routes())

export default router
