import KoaRouter from 'koa-router'
import Project from '../../../models/Project'
import * as fileUtils from '../../../utils/file'

const router = new KoaRouter({
  prefix: '/projects'
})

router.get('/', async ctx => {
  try {
    const projects = await Project.findAndPopulate()
    ctx.body = projects
  } catch (err) {
    throw err
  }
})

router.get('/:_id', async ctx => {
  const project = await Project.findAndPopulate({ _id: ctx.params._id }).pop()
  ctx.body = project
})

router.post('/', async ctx => {
  try {
    const payload = ctx.request.fields
    if (!payload) {
      ctx.status = 400
      return
    }
    const {images, ...newProject} = ctx.request.fields
    const imagesPathArr = await fileUtils.save.images(images)
    newProject.images = imagesPathArr
    newProject.userId = ctx.state.user._id
    ctx.body = await Project.createProject(newProject)
  } catch (err) {
    throw err
  }
})

export default router
