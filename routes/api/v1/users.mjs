import express from 'express'
import * as User from '../../../models/User'

const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.getAllUsers()
  res.send({users}).status(204)
})

router.post('/register', async (req, res, next) => {
  try {
  const {email, password} = req.body;
  if(!email || !password) {
    res.send('Please enter your email and password to register.').status(412).end();
    return null
  }
  await User.createUser({email, password});
  res.json('User has been successfully created.').status(200).end();
 }catch(err) {
    next(err)
 } 
})

export default router
