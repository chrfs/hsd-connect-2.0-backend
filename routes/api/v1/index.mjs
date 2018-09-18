import Router from 'koa-router'
import version from '../version'
import users from './users'
import notFound from './notFound'

const router = new Router()

router.use(version.routes())
router.use(users.routes())
router.use(notFound.routes())

export default router
