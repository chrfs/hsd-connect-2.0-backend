import env from "../config/env";

const responseFormatter: any = {};

responseFormatter.send = (ctx: any, err: Error) => {
  try {
    ctx.body = {
      version: env.API.VERSION,
      timestamp: Date.now(),
      status: ctx.status,
      data: JSON.parse(JSON.stringify(ctx.body || null)),
      errors: err || null
    };
  } catch (err) {
    throw err;
  }
};

responseFormatter.formatValidationErrors = (validationErrors: any) => {
  const formattedResponse = Object.keys(validationErrors.errors).reduce(
    (errorsAcc: any, field: string) => {
      errorsAcc[field] = validationErrors.errors[field].message;
      return errorsAcc;
    },
    {}
  );
  return formattedResponse;
};

export default responseFormatter;
