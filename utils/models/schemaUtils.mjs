import { ValidationError } from '../errors'

export const schemaValidators = {
  validateLength: function (propertyName = 'field', minLength = 0, maxLength = 0) {
    return function (next) {
      try {
        if(!this.isNew && !this.isModified(propertyName)) return next()
        const isValid = this[propertyName].length >= minLength && this[propertyName].length <= maxLength
        if(!isValid) throw schemaValidatorErrors.invalidLength(propertyName, minLength, maxLength)
        return next()
      } catch (err) {
        throw err
      }
    }
  },
  validateProperty: function(propertyName, callback, err) {
    return async function (next) {
      try{
        if (!this.isNew && !this.isModified(propertyName)) return true
        const isValid = await callback({ [propertyName]: this[propertyName] })
        if (!isValid) throw err
        return next()
      } catch (err) {
        throw err
      }
    }
  },
}

export const schemaUtils = {
  setPropertyDate: function (propertyName) {
    return function (next) {
      this[propertyName] = Date.now()
      next()
    }
  }
}

export const schemaValidatorErrors = {
  invalidLength: function (propertyName, minLength, maxLength) {
    let err = `The ${propertyName} has to have a `
      if (minLength && maxLength) {
        err += `length between ${minLength} and ${maxLength} characters.`
      } else {
        err += minLength
          ? `min length of ${minLength} characters.`
          : `max length of ${maxLength} characters.`
      }
    return new ValidationError(propertyName, err)
  }
}

export const schemaValidatorMessages =  {
  isRequired: (propertyName = 'field') => {
    return `The ${propertyName} is required, please fill it out.`
  }
}
