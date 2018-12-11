import Router from 'koa-router'
import { authorizeUser } from './middleware/authorization'
import * as Project from '../../../models/Project'

const router = new Router({
  prefix: '/projects'
})

router.use(authorizeUser)

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
    const newProject = ctx.request.fields
    if (!newProject) {
      ctx.status = 400
      return
    }
    newProject.userId = ctx.state.user._id
    ctx.body = await Project.createProject(newProject)
  } catch (err) {
    throw err
  }
})

export default router
