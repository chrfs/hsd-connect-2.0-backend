import Router from 'koa-router'
import env from '../../config/env'

const router = new Router({
  prefix: '/'
})

router.get('/', ctx => {
  ctx.body = `API_VERSION: ${env.API.VERSION}`
})

export default router
