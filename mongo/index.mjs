import mongoose from 'mongoose'
import env from '../config/env'
import logger from '../utils/logger'

const mongo = {}

mongoose.connection.on('error', err => {
  logger.error('Database connection error has occured.', err)
})

mongoose.connection.once('open', () => {
  logger.info('Database connection is established')
  logger.info(
    `API is up running at http://${env.API.HOST}:${env.API.PORT}${env.API.PATH}/`
  )
})

mongo.connect = async () => {
  try {
    const mongooseOptions = {
      user: env.MONGO.USERNAME,
      pass: env.MONGO.PASSWORD,
      authSource: 'admin',
      useNewUrlParser: true,
      useCreateIndex: true
    }
    await mongoose.connect(
      `${env.MONGO.HOST}:${env.MONGO.PORT}/${env.MONGO.DATABASE}`,
      mongooseOptions
    )
  } catch (err) {}
}

mongo.disconnect = () => mongoose.connection.close()

export default mongo
