import Koa from 'koa'
import cors from '@koa/cors'
import convert from 'koa-convert'
import body from 'koa-better-body'
import mongoClient from './mongo'
import env from './config/env'
import api from './routes'
import responseFormatter from './utils/responseFormatter'
import logger from './utils/logger'

const app = new Koa()

mongoClient.connect()
if (env.TYPE === 'development') app.use(cors())
app.listen(env.API.PORT)
app.use(convert(body()))

app.use(async (ctx, next) => {
  try {
    await next()
    responseFormatter.send(ctx)
  } catch (err) {
    ctx.status = err.status || 500
    ctx.app.emit('error', err, ctx)
  }
})

app.on('error', async (err, ctx) => {
  logger.error(err)
  if (err.name === 'ValidationError') {
    const validationErrors = responseFormatter.formatValidationErrors(err)
    ctx.status = 400
    responseFormatter.send(ctx, validationErrors)
    return
  }
  responseFormatter.send(ctx, err)
})

app.use(api.routes())
