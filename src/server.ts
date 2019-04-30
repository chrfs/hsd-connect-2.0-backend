import cors from "@koa/cors";
import Koa from "koa";
import body from "koa-better-body";
import convert from "koa-convert";
import helmet from "koa-helmet";
import env from "./config/env";
import mongoClient from "./mongo";
import api from "./routes";
import logger from "./utils/logger";
import responseFormatter from "./utils/responseFormatter";

const app: any = new Koa();
mongoClient.connect();
if (env.TYPE === "development") app.use(cors());
app.listen(env.API.PORT);
app.use(convert(body({ jsonStrict: true, jsonLimit: "10mb" })));

app.use(helmet());
app.use(async (ctx: any, next: any) => {
  try {
    await next();
    if (ctx.state.formatResponse === false) return;
    responseFormatter.send(ctx);
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.app.emit("error", err, ctx);
  }
});

app.on("error", async (err: Error, ctx: any) => {
  logger.error(err);
  if (err.name === "ValidationError") {
    const validationErrors = responseFormatter.formatValidationErrors(err);
    ctx.status = 400;
    responseFormatter.send(ctx, validationErrors);
    return;
  }
  responseFormatter.send(ctx, err);
});

app.use(api.routes());
