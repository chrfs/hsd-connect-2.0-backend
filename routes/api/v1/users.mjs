import KoaRouter from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../../config/env'
import * as helpers from './helpers'
import * as User from '../../../models/User'

const router = new KoaRouter({
  prefix: '/users'
})

const setParameters = (ctx, next) => {
  ctx.user = ctx.request.body.user ? ctx.request.body.user : null
  next()
}

router.use(setParameters)

router.post('/register', async ctx => {
  try {
    if (!ctx.user) {
      ctx.throw(406, 'Payload not accepted.')
    }

    const { email, password } = ctx.request.body.user
    ctx.body = helpers.formatResponse({
      data: { user: await User.createUser({ email, password }) }
    })
  } catch (err) {
    ctx.throw(
      400,
      'Validation error',
      JSON.stringify(helpers.formatResponse(err))
    )
  }
})

router.post('/login', async ctx => {
  try {
    if (!(ctx.request.body.user &&
        ctx.request.body.user.email &&
        ctx.request.body.user.password)) {
      ctx.throw(406, 'Payload not accepted.')
    }
    const requestedUser = (await User.findUser({
      email: ctx.request.body.user.email
    })).pop()
    const queryPassword = ctx.request.body.user.password

    if (requestedUser && requestedUser.password && queryPassword) {
      const authStatus = bcrypt.compareSync(
        queryPassword,
        requestedUser.password
      )

      if (!authStatus) {
        ctx.throw(401)
      }

      const response = {
        _id: requestedUser._id,
        email: requestedUser.email,
        fullName: requestedUser.fullName,
        settings: requestedUser.settings,
        authorization: requestedUser.authorization
      }
      const authToken = jwt.sign(
        {
          _id: response._id,
          email: response.email
        },
        env.JWT.SECRET,
        {
          expiresIn: env.JWT.EXPIRES_IN
        }
      )
      ctx.res.send(
        helpers.formatResponse({
          data: { authToken, user: response }
        })
      )
    }
  } catch (err) {
    console.log('err', err)
    ctx.throw(401, 'Unauthorized', JSON.stringify(helpers.formatResponse(err)))
  }
})

export default router
