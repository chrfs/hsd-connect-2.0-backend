import KoaRouter from 'koa-router'
import users from './users'
import projects from './projects'
import authorization from './middleware/authorization'

const router = new KoaRouter()

router.use(users.routes()) // uses authorization within
router.use(authorization, projects.routes())

export default router
