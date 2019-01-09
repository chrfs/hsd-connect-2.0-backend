import KoaRouter from 'koa-router'
import fileType from 'file-type'
import Project from '../../../models/Project'
import ProjectFeedback from '../../../models/ProjectFeedback'
import fs from 'fs'
import authorization from './middleware/authorization'
import { parse, saveFiles, deleteFile } from '../../../utils/file'
import mongoose from 'mongoose'

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

router.use(authorization)

router.get('/', async ctx => {
  try {
    const projects = await Project.find().populate({
      path: 'user',
      model: 'User',
      select: 'firstname lastname'
    }).select('-images.path')
    ctx.body = projects
  } catch (err) {
    throw err
  }
})

router.get('/:projectId', async ctx => {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.projectId)) {
    ctx.status = 404
    return
  }
  const project = (await Project.findOne({ _id: ctx.params.projectId }).populate({
    path: 'user',
    model: 'User',
    select: 'firstname lastname image'
  }).populate({
    path: 'members',
    model: 'User',
    select: 'firstname lastname image'
  }).select('-images.path')).toObject()
  project.feedback = await ProjectFeedback.find({ project: ctx.params.projectId }).populate({
    path: 'user',
    model: 'User',
    select: 'firstname lastname image optionalInformation'
  }).populate({
    path: 'comments.user',
    model: 'User',
    select: 'firstname lastname image optionalInformation'
  })
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
    const parsedImages = await parse.images(projectProperties.images, 1000)
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
    const previousImages = JSON.parse(JSON.stringify(project.images || []))
    if (!project.user._id.equals(ctx.state.user._id)) {
      ctx.status = 401
      return
    }
    project.title = ctx.request.fields.title
    project.description = ctx.request.fields.description
    project.images = ctx.request.fields.images
    project.searchingParticipants = ctx.request.fields.searchingParticipants
    const receivedImages = ctx.request.fields.images.map(image => {
      if (!image._id || !Number.isFinite(image.orderNo)) {
        return image
      }
      const previousImage = previousImages.find(img => img._id === image._id)
      if (!previousImage) {
        return
      }
      return { ...previousImage, orderNo: Number.parseInt(image.orderNo, 10) }
    })
    const parsedImages = await parse.images(receivedImages, 1000)
    project.images = parsedImages.files
    await project.validate()
    await saveFiles.images(parsedImages.saveDir, parsedImages.files)
    const updatedProject = await project.save()
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

router.post('/:projectId/feedback', async ctx => {
  try {
    const { feedback } = ctx.request.fields
    const projectfeedbackId = (await (new ProjectFeedback({
      content: feedback.content,
      project: ctx.params.projectId,
      user: ctx.state.user._id
    })).save())._id
    ctx.body = await ProjectFeedback.findOne({ _id: projectfeedbackId }).populate({
      path: 'user',
      model: 'User',
      select: 'firstname lastname image optionalInformation'
    }).populate({
      path: 'comments.user',
      model: 'User',
      select: 'firstname lastname image optionalInformation'
    })
  } catch (err) {
    throw err
  }
})

router.post('/:projectId/feedback/:feedbackId/comment', async ctx => {
  try {
    const { comment } = ctx.request.fields
    const projectFeedback = await ProjectFeedback.findOne({ _id: ctx.params.feedbackId })
    comment.user = ctx.state.user._id
    projectFeedback.comments.push(comment)
    await projectFeedback.validate()
    await projectFeedback.save()
    ctx.body = await ProjectFeedback.findOne({ _id: ctx.params.feedbackId }).populate({
      path: 'user',
      model: 'User',
      select: 'firstname lastname image optionalInformation'
    }).populate({
      path: 'comments.user',
      model: 'User',
      select: 'firstname lastname image optionalInformation'
    })
  } catch (err) {
    throw err
  }
})

router.put('/:projectId/feedback/:feedbackId/like', async ctx => {
  try {
    const projectfeedback = await ProjectFeedback.findOne({ project: ctx.params.projectId, _id: ctx.params.feedbackId })
    if (!projectfeedback) {
      ctx.status = 404
      return
    }
    if (projectfeedback.likedBy.some(userId => userId.equals(ctx.state.user._id))) {
      projectfeedback.likedBy.splice(projectfeedback.likedBy.indexOf(ctx.state.user._id), 1)
    } else {
      projectfeedback.likedBy.push(ctx.state.user._id)
    }
    await projectfeedback.save()
    ctx.body = { likedBy: projectfeedback.likedBy }
  } catch (err) {
    throw err
  }
})

router.put('/:projectId/like', async ctx => {
  try {
    const project = await Project.findOne({ _id: ctx.params.projectId })
    if (!project) {
      ctx.status = 404
      return
    }
    if (project.likedBy.some(userId => userId.equals(ctx.state.user._id))) {
      project.likedBy.splice(project.likedBy.indexOf(ctx.state.user._id), 1)
    } else {
      project.likedBy.push(ctx.state.user._id)
    }
    await project.save()
    ctx.body = { likedBy: project.likedBy }
  } catch (err) {
    throw err
  }
})

export default router
