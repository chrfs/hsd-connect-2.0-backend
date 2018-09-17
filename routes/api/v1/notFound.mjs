import express from 'express'

const router = express.Router()

router.use((req, res, next) => {
  res
    .send('Oops, something went wrong ;/!')
    .status(404)
    .end()
  return null
})

export default router
