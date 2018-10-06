import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import mongoose from 'mongoose'
import env from './config/env'
import api from './routes'
import responseFormatter from './utils/formatters/response'

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
  console.log(err)
})
mongooseConnection.once('open', () => {
  console.log('Connection to database is established')
  console.log(
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
    responseFormatter(ctx)
  } catch (err) {
    ctx.app.emit('error', err, ctx)
  }

  app.on('error', (err, ctx) => {
    if ((err instanceof Error && err.status >= 500 && 
        err.name !== 'ValidationError' &&
        err.name !== 'MongoError') ||
        err.expose === false) {
      ctx.body = 'an unexpected error has occurred'
      ctx.status = 500
      return
    }
    ctx.state.error = err
    responseFormatter(ctx)
  })
})

app.use(api.routes())
