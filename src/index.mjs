import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import env from './config/env';
import api from './routes';

const con = mongoose.connection;
const app = new Koa();

mongoose.connect('mongodb://localhost:27017/hsdconnect');
con.on('error', (err) => {
  console.log(err);
});
con.once('open', () => {
  console.log('Connection to database is established');
});

app.use(bodyParser({
  onerror: (err, ctx) => ctx.throw('Content-Type is not allowed', 400),
}));
app.listen(env.API.PORT);
app.use(api.routes());

