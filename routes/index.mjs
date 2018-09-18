import Router from 'koa-router'
import env from '../config/env'

const router = new Router({
  prefix: env.API.PATH
})

const loadAPIAsync = async (apiPath) => {
  router.use((await import(apiPath)).default.routes())
}
const apiPath = `.${env.API.PATH}`
loadAPIAsync(apiPath)

export default router
