import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import mongoose from 'mongoose'
import env from './config/env'
import api from './routes'

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
    `API is up running on http://${env.API.HOST}:${env.API.PORT}${
      env.API.PATH
    }/`
  )
})

app.listen(env.API.PORT)
if (env.TYPE === 'development') app.use(cors())
app.use(
  bodyParser({
    detectJSON: function (ctx) {
      return /\.json$/i.test(ctx.path)
    }
  })
)

app.on('error', (err, ctx) => {
  if (err.name === 'ValidationError') {
    ctx.status = 400
    return
  }
  console.error(err)
  throw err
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

app.use(api.routes())
