import Router from 'koa-router'
import env from '../config/env'
import version from './api/common/version'
// import notFound from './api/common/notFound'

const router = new Router({
  prefix: env.API.PATH
})

const loadAPIAsync = async apiPath => {
  router.use((await import(apiPath)).default.routes())
  router.use(version.routes())
  // router.use(notFound.routes())
}
loadAPIAsync(env.API.RELATIVE_PATH)

export default router
