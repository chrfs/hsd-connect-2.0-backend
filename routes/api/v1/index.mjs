import KoaRouter from 'koa-router'
import users from './users'
import projects from './projects'
import images from './images'
import authorization from './middleware/authorization'

const router = new KoaRouter()

router.use(images.routes())
router.use(users.routes()) // uses authorization within
router.use(authorization)
router.use(projects.routes())

export default router
