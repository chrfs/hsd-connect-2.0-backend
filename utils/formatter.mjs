import env from '../config/env'

const formatter = {}

formatter.formatResponse = (ctx, err) => {
  try {
    ctx.body = {
      version: env.API.VERSION,
      datestamp: new Date(),
      timestamp: Date.now(),
      response_time: Math.ceil(Date.now() - ctx.state.requestStart) + 'ms',
      status: ctx.status,
      data: JSON.parse(JSON.stringify(ctx.body || null)),
      error: err || null
    }
  } catch (err) {
    throw err
  }
}

export default formatter
