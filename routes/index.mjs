import Router from 'koa-router'
import env from '../config/env'

const router = new Router({
  prefix: env.API.PATH
})

router.get('/', async ctx => {
  ctx.status = 200
})

// const loadAPI = async apiPath => {
//   router.use((await import(apiPath)).default.routes())
// }
// loadAPI(env.API.RELATIVE_PATH)

export default router
