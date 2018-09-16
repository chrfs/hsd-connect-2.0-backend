import KoaRouter from 'koa-router'
import env from '../../../config/env'
import version from '../version'
import users from './users'

const router = new KoaRouter({
  prefix: env.API.PATH
})

router.use(version.routes())
router.use(users.routes())

export default router
