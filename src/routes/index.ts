import Koa from 'koa'
import KoaRouter from 'koa-router'
import env from '../config/env'
import api from './api/v1'

const router = new KoaRouter({
  prefix: env.API.PATH
})

router.get('/', async (ctx: Koa.Context) => {
  ctx.status = 200
})

router.use(api.routes())

export default router
