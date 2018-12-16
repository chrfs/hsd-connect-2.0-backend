import KoaRouter from 'koa-router'
import env from '../config/env'
import apiv1 from './api/v1'

const router = new KoaRouter({
  prefix: env.API.PATH
})

router.get('/', async ctx => {
  ctx.status = 200
})

router.use(apiv1.routes())

export default router
