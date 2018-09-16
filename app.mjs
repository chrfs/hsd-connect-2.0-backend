import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import env from './config/env'
import routes from './routes'

const app = express()
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
  console.log(`API is up running on http://${env.API.HOST}:${env.API.PORT}${env.API.PATH}`)
})

app.listen(env.API.PORT)
app.use(bodyParser.json())
app.use(cors())
app.use(routes)
