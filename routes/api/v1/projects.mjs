import Router from 'koa-router'
import * as Project from '../../../models/Project'

const router = new Router({
  prefix: '/projects'
})

router.get('/', async ctx => {
  try {
    const projects = await Project.findProjects()
    ctx.body = projects
  } catch (err) {
    throw err
  }
})

router.get('/:_id', async ctx => {
  const project = await Project.findProject({ _id: ctx.params._id })
  ctx.body = project
})

router.post('/', async ctx => {
  try {
    const newProject = ctx.request.body
    if (!newProject) {
      ctx.status = 400
      return
    }
    newProject.userId = ctx.state.user._id
    const project = await Project.createProject(newProject)
    ctx.body = project
  } catch (err) {
    throw err
  }
})

export default router
