import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import mongoose from 'mongoose'
import koaCors from '@koa/cors'
import env from './config/env'
import api from './routes'

const con = mongoose.connection
const app = new Koa()

mongoose.connect('mongodb://localhost:27017/hsdconnect')
con.on('error', err => {
  console.log(err)
})
con.once('open', () => {
  console.log('Connection to database is established')
})

if (env.TYPE === 'development') {
  app.use(koaCors())
}
app.use(
  bodyParser()
)
app.listen(env.API.PORT)
app.use(api.routes())
