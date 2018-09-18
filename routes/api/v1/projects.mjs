import Router from 'koa-router'
import * as Project from '../../../models/Project'

const router = new Router({
  prefix: '/projects'
})

router.get('/', async ctx => {
  const projects = await Project.getAllUsers()
  ctx.body = { projects }
})

export default router
