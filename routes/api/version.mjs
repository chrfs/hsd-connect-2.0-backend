import express from 'express'
import env from '../../config/env'

const router = express.Router()

router.get('/', (req, res) => {
  res.send(`API_VERSION: ${env.API.VERSION}`)
})

export default router
