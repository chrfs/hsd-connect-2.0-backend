export const validateLength = function (min, max) {
  return function (propertyName) {
    return this[propertyName].length >= min && this[propertyName].length <= max
  }
}

export const setDate = function (propertyName) {
  return function (next) {
    this[propertyName] = Date.now()
    next()
  }
}
