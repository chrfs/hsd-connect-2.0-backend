import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import mongoose from 'mongoose'
import env from './config/env'
import api from './routes'
import response from './utils/response'
import logger from './utils/logger'

const app = new Koa()

const mongooseOptions = {
  user: env.MONGO.USERNAME,
  pass: env.MONGO.PASSWORD,
  auth: { authdb: 'admin' },
  useNewUrlParser: true
}
mongoose.connect(`mongodb://localhost:27017/hsdconnect`, mongooseOptions)
const mongooseConnection = mongoose.connection
mongooseConnection.on('error', err => {
  logger.error(err)
})
mongooseConnection.once('open', () => {
  logger.info('Connection to database is established')
  logger.info(
    `API is up running at http://${env.API.HOST}:${env.API.PORT}${
      env.API.PATH
    }/`
  )
})

app.listen(env.API.PORT)
if (env.TYPE === 'development') app.use(cors())
app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next()
    response.send(ctx)
  } catch (err) {
    ctx.status = err.status || 500
    ctx.app.emit('error', err, ctx)
  }
})

app.use(api.routes())

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
