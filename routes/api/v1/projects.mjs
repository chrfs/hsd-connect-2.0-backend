import Router from 'koa-router'
import * as Project from '../../../models/Project'

const router = new Router({
  prefix: '/projects'
})

router.get('/', async ctx => {
  const projects = await Project.findProjects()
  ctx.body = { projects }
})

router.get('/:_id', async ctx => {
  const project = await Project.findProject({ _id: ctx.params._id })
  ctx.body = project
})

router.post('/', async (ctx, next) => {
  try {
    const newProject = ctx.body.project
    if (!newProject) {
      ctx.status = 401
      return
    }
    const project = await Project.createProject(newProject)
    ctx.body = project
  } catch (err) {
    throw err
  }
})

export default router
