import jwt from 'jsonwebtoken'
import env from '../../../config/env'

export default (req, res, next) => {
  try {
    const authorization = jwt.verify(req.header.authorization, env.JWT.SECRET)
    if (!authorization) {
      res.status(401).end()
    }
    next()
  } catch (err) {
    next(err)
  }
}
