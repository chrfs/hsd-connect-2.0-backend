import env from '../config/env'

const response = {}

response.send = (ctx, err) => {
  try {
    ctx.body = {
      version: env.API.VERSION,
      datestamp: new Date(),
      timestamp: Date.now(),
      status: ctx.status,
      data: JSON.parse(JSON.stringify(ctx.body || null)),
      errors: err || null
    }
  } catch (err) {
    throw err
  }
}

response.formatValidationErrors = (validationErrors) => {
  const formattedResponse = Object.keys(validationErrors.errors).reduce((errorsAcc, field) => {
    errorsAcc[field] = validationErrors.errors[field].message
    return errorsAcc
  }, {})
  return formattedResponse
}

// response.formatData = (data) => {
//   if (!(data instanceof Object)) {
//     return data
//   }
//   const formattedResponse = Object.keys(data).reduce((dataAcc, field) => {
//     dataAcc[field] = {
//       message: data.field
//     }
//     return dataAcc
//   }, {})
//   return formattedResponse
// }

export default response
