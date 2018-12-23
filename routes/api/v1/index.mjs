import KoaRouter from 'koa-router'
import users from './users'
import projects from './projects'

const router = new KoaRouter()

router.use(users.routes()) // uses authorization within
router.use(projects.routes())

export default router
