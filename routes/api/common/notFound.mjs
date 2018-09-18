import Router from 'koa-router'

const router = new Router()
router.all('/*', async ctx => {
  ctx.body = 'Oh snap, something went wrong ;/!'
  ctx.status = 404
})

export default router
