import KoaRouter from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../../config/env'
import authorization from './middleware/authorization'
import User from '../../../models/User'
import Project from '../../../models/Project'

const router = new KoaRouter({
  prefix: '/users'
})

const authenticateUser = function (password, user) {
  try {
    if (!user) {
      return false
    }
    return bcrypt.compare(password, user.password)
  } catch (err) {
    throw err
  }
}

const createJWT = async function (user) {
  try {
    const newJWT = jwt.sign({ user: user }, env.JWT.SECRET, {
      expiresIn: env.JWT.EXPIRES_IN
    })
    return newJWT
  } catch (err) {
    throw err
  }
}

router.post('/', async (ctx) => {
  try {
    const { email, password } = ctx.request.fields
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to register.'
      ctx.status = 401
      return
    }
    await User.createUser({ email, password })
    ctx.body = 'User has been successfully created.'
  } catch (err) {
    throw err
  }
})

router.post('/auth', async ctx => {
  try {
    const { email, password } = ctx.request.fields
    if (!email || !password) {
      ctx.body = 'Please enter your email and password to authenticate.'
      return
    }
    const user = await User.findOne({ email }).select(
      '_id firstname lastname email password bookmarkedProjects settings'
    )
    const authStatus = await authenticateUser(password, user)
    if (!authStatus) {
      ctx.body = 'Authentification failed, please check your credentials'
      ctx.status = 401
      return
    }
    const {password: removed, ...userRest} = user.toObject()
    ctx.body = { authToken: await createJWT(userRest), user: userRest }
    return
  } catch (err) {
    throw err
  }
})

router.use(authorization)

router.get('/:userId', async ctx => {
  try {
    if (ctx.state.user._id !== ctx.params.userId) {
      ctx.status = 401
      return
    }
    const user = await User.findOne({ _id: ctx.params.userId})
    ctx.body = { user }
  } catch (err) {
    throw err
  }
})

router.put('/:userId/bookmark/:projectId', async ctx => {
  try {
    if (ctx.params.userId !== ctx.state.user._id) {
      ctx.status = 401
      return
    }
    const user = await User.findOne({ _id: ctx.params.userId})
    const project = await Project.findOne({ _id: ctx.params.projectId})
    if (!user || !project) {
      ctx.status = 404
      return
    }
    if (user.bookmarkedProjects.some(bookmark => bookmark.equals(project._id))) {
      user.bookmarkedProjects.splice(user.bookmarkedProjects.indexOf(project._id), 1)
    } else {
      user.bookmarkedProjects.push(project._id)
    }
    await user.save()
    ctx.body = {bookmarkedProjects: user.bookmarkedProjects}
  } catch (err) {
    throw err
  }
})

export default router
