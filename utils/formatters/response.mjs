import env from '../../config/env'

export default async (ctx) => {
  try {
    ctx.body = {
      version: env.API.VERSION,
      date: new Date(),
      timestamp: Date.now(),
      response_time: Math.ceil(Date.now() - ctx.state.requestStart) + 'ms',
      status: ctx.status,
      data: ctx.body,
      error: ctx.state.error
    }
  } catch (err) {
    throw err
  }
}
