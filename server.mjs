import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import mongoose from 'mongoose'
import env from './config/env'
import api from './routes'
import formatter from './utils/formatter'
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
    ctx.state.requestStart = Date.now()
    await next()
    formatter.formatResponse(ctx)
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

app.on('error', async (err, ctx) => {
  logger.error(err)
  formatter.formatResponse(ctx, err)
})

app.use(api.routes())
