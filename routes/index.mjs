import Router from 'koa-router'
import env from '../config/env'

const router = new Router({
  prefix: env.API.PATH
})

const loadAPI = async apiPath => {
  router.use((await import(apiPath)).default.routes())
}
loadAPI(env.API.RELATIVE_PATH)

export default router
