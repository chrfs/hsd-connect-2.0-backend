import mongoose from 'mongoose'

export const ValidationError = function (fieldName, message) {
  const validationError = new mongoose.Error.ValidationError(null)
  validationError.addError(
    fieldName,
    new mongoose.Error.ValidatorError({ message })
  )
  validationError.name = 'ValidationError'
  return validationError
}
