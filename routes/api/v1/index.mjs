import express from 'express'
import version from '../version'
import users from './users'
import notFound from './notFound'

const router = express.Router()
router.use('/version', version)
router.use('/users', users)
router.use(notFound)

export default router
