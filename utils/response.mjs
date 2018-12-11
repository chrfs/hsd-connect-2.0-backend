import env from '../config/env'

const response = {}

response.send = (ctx, err) => {
  try {
    ctx.body = {
      version: env.API.VERSION,
      timestamp: Date.now(),
      status: ctx.status,
      data: JSON.parse(JSON.stringify(ctx.body || null)),
      errors: err || null
    }
  } catch (err) {
    throw err
  }
}

response.formatValidationErrors = validationErrors => {
  const formattedResponse = Object.keys(validationErrors.errors).reduce(
    (errorsAcc, field) => {
      errorsAcc[field] = validationErrors.errors[field].message
      return errorsAcc
    },
    {}
  )
  return formattedResponse
}

export default response
