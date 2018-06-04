import KoaRouter from 'koa-router';
import * as User from '../../../models/User';
import * as helpers from './helpers.mjs';

const router = new KoaRouter({
  prefix: '/users'
});

router.post('/', async(ctx) => {
  try{
    ctx.body = helpers.formatResponse({ data: { user: await User.createUser(ctx.request.body)}});
  }catch(err) {
    console.log('err', err);
    ctx.throw(400, 'Validation error', JSON.stringify(helpers.formatResponse(err)));
  }
});

export default router;