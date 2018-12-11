import Koa from 'koa'
import cors from '@koa/cors'
import convert from 'koa-convert'
import body from 'koa-better-body'
import mongo from './mongo'
import env from './config/env'
import api from './routes'
import response from './utils/response'
import logger from './utils/logger'

const app = new Koa()

mongo.connect()
if (env.TYPE === 'development') app.use(cors())
app.listen(env.API.PORT)
app.use(convert(body()))

app.use(async (ctx, next) => {
  try {
    logger.info(ctx)
    await next()
    response.send(ctx)
  } catch (err) {
    ctx.status = err.status || 500
    ctx.app.emit('error', err, ctx)
  }
})

app.on('error', async (err, ctx) => {
  logger.error(err)
  if (err.name === 'ValidationError') {
    const validationErrors = response.formatValidationErrors(err)
    ctx.status = 400
    response.send(ctx, validationErrors)
    return
  }
  response.send(ctx, err)
})

app.use(api.routes())
