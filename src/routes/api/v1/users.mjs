import KoaRouter from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../../../config/env'
import * as helpers from './helpers'
import * as User from '../../../models/User'

const router = new KoaRouter({
  prefix: '/users'
})

router.post('/register', async ctx => {
  try {
    console.log(ctx.request.body)
    if (ctx.request.body.user) {
      const { email, password } = ctx.request.body.user
      ctx.body = helpers.formatResponse({
        data: { user: await User.createUser({ email, password }) }
      })
    } else {
      ctx.throw(406, 'Payload not accepted.')
    }
  } catch (err) {
    console.log('err', err)
    ctx.throw(
      400,
      'Validation error',
      JSON.stringify(helpers.formatResponse(err))
    )
  }
})

router.post('/login', async ctx => {
  try {
    if (
      !!ctx.request.body.user &&
      !!ctx.request.body.user.email &&
      ctx.request.body.user.password
    ) {
      let responseStatus = false
      const requestedUser = (await User.findUser({
        email: ctx.request.body.user.email
      })).pop()
      const queryPassword = ctx.request.body.user.password

      if (!!requestedUser && !!requestedUser.password && !!queryPassword) {
        const authenticationStatus = bcrypt.compareSync(
          queryPassword,
          requestedUser.password
        )

        if (authenticationStatus) {
          const response = {
            _id: requestedUser._id,
            email: requestedUser.email,
            fullName: requestedUser.fullName,
            settings: requestedUser.settings,
            authorization: requestedUser.authorization
          }
          const authToken = jwt.sign(
            {
              email: response.email,
              settings: response.settings,
              authorization: response.authorization
            },
            env.JWT.SECRET,
            {
              expiresIn: env.JWT.EXPIRES_IN
            }
          )
          ctx.body = helpers.formatResponse({
            data: { authToken, user: response }
          })
          responseStatus = true
        }
      }
      if (!responseStatus) {
        const err = {
          errors: {
            login: {
              message:
                'Es existiert kein Account unter diesen Zugangsdaten, bitte prüfe Deine Eingaben.'
            }
          }
        }
        throw err
      }
    } else {
      ctx.throw(406, 'Payload not accepted.')
    }
  } catch (err) {
    console.log('err', err)
    ctx.throw(401, 'Unauthorized', JSON.stringify(helpers.formatResponse(err)))
  }
})

export default router
