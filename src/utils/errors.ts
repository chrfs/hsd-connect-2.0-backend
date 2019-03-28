import mongoose from 'mongoose'

export const ValidationError = function (fieldName: string, message: string) {
  const validationError = new (mongoose.Error as any).ValidationError(null)
  validationError.addError(fieldName, new (mongoose.Error as any).ValidatorError({ message }))
  validationError.name = 'ValidationError'
  return validationError
}
