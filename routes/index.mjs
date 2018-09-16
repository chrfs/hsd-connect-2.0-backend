import express from 'express'
import env from '../config/env'

const router = express.Router()
const loadAPI = async () => router.use(env.API.PATH, (await import(`.${env.API.PATH}`)).default);

loadAPI();
export default router
