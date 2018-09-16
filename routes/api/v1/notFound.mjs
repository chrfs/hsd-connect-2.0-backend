import KoaRouter from 'koa-router'

const router = new KoaRouter()

router.get('/*', ctx => {
  ctx.status = 404;
  ctx.body = 'Oops, something went wrong ;/!'
})

export default router
