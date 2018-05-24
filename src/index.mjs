import Koa from 'koa';
import env from './config/env';
import api from './routes';

const app = new Koa();
app.listen(env.API.PORT);
app.use(api.routes());

