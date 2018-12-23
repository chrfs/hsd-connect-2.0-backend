import KoaRouter from 'koa-router'
import fileType from 'file-type'
import Project from '../../../models/Project'
import fs from 'fs'
import authorization from './middleware/authorization'
import { parse, saveFiles, deleteFile } from '../../../utils/file'

const router = new KoaRouter({
  prefix: '/projects'
})

router.get('/:projectId/images/:imageToken', async ctx => {
  try {
    const { projectId, imageToken } = ctx.params
    const project = (await Project.findOne({_id: projectId, 'images.token': imageToken}).select('images'))
    const image = project.images.find(image => image.token === imageToken)
    const imagePath = image ? image.path + image.name : null
    if (!fs.existsSync(imagePath)) {
      ctx.status = 404
      return
    }
    ctx.body = fs.readFileSync(imagePath)
    ctx.set('Content-Type', fileType(ctx.body).mime)
    ctx.set('Cache-Control', 'max-age=3600')
    ctx.state.formatResponse = false
  } catch (err) {
    throw err
  }
})

router.delete('/:projectId/images/:imageToken', async ctx => {
  try {
    const { projectId, imageToken } = ctx.params
    await Project.update({_id: projectId}, {$pull: { images: {token: imageToken} }})
  } catch (err) {
    throw err
  }
})

router.use(authorization)

router.get('/', async ctx => {
  try {
    const projects = await Project.find().select('-images.path')
    ctx.body = projects
  } catch (err) {
    throw err
  }
})

router.get('/:projectId', async ctx => {
  const project = (await Project.findOne({ _id: ctx.params.projectId }).select('-images.path'))
  ctx.body = project
})

router.post('/', async ctx => {
  try {
    const payload = ctx.request.fields
    if (!payload) {
      ctx.status = 400
      return
    }
    const projectProperties = ctx.request.fields
    projectProperties.user = ctx.state.user._id
    const newProject = Project.createProject(projectProperties)
    const parsedImages = await parse.images(projectProperties.images)
    newProject.images = parsedImages.files
    await newProject.validate()
    await saveFiles.images(parsedImages.saveDir, parsedImages.files)
    ctx.body = await newProject.save()
  } catch (err) {
    throw err
  }
})

router.put('/:projectId', async ctx => {
  try {
    const project = await Project.findOne({ _id: ctx.params.projectId })
    const previousImages = JSON.parse(JSON.stringify(project.images))
    if (!project.user._id.equals(ctx.state.user._id)) {
      ctx.status = 401
      return
    }
    const requestedProject = Project.updateProject(project, ctx.request.fields)
    const parsedImages = await parse.images(ctx.request.fields.images)
    requestedProject.images = parsedImages.files
    await requestedProject.validate()
    await saveFiles.images(parsedImages.saveDir, parsedImages.files)
    const updatedProject = await requestedProject.save()
    const deletedImages = previousImages.filter((img1) => {
      return !updatedProject.images.some((img2) => img1.name === img2.name)
    })
    await Promise.all(deletedImages.map(async (image) => {
      await deleteFile((image.path + image.name))
    }))
  } catch (err) {
    throw err
  }
})

export default router
