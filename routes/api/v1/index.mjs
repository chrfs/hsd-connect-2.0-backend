import KoaRouter from 'koa-router'
import env from '../../../config/env'
import version from '../version'
import users from './users'
import notFound from './notFound'

const router = new KoaRouter({
  prefix: env.API.PATH
})

router.use(version.routes())
router.use(users.routes())
router.use(notFound.routes())

export default router
