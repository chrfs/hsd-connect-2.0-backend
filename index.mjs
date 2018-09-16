import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import mongoose from 'mongoose'
import koaCors from '@koa/cors'
// import logger from 'logge
import env from './config/env'
import api from './routes'

const app = new Koa()

const mongooseConnection = mongoose.connection
mongoose.connect('mongodb://localhost:27017/hsdconnect', { useNewUrlParser: true })
mongoose.set('useCreateIndex', true);
mongooseConnection.on('error', err => {
  console.log(err)
})
mongooseConnection.once('open', () => {
  console.log('Connection to database is established')
})

if (env.TYPE === 'development') {
  app.use(koaCors())
}
app.use(bodyParser())
app.listen(env.API.PORT)
app.use(api.routes())
