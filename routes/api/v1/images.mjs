import KoaRouter from 'koa-router'
import Image from '../../../models/Image'
import fileType from 'file-type'
import fs from 'fs'

const router = new KoaRouter({
  prefix: '/images'
})

router.get('/:token', async ctx => {
  try {
    const img = await Image.findOne({token: ctx.params.token})
    if (!fs.existsSync(img)) return
    ctx.body = fs.readFileSync(img.path)
    ctx.set('Content-Type', fileType(ctx.body).mime)
    ctx.state.formatResponse = false
  } catch (err) {
    throw err
  }
})

export default router
