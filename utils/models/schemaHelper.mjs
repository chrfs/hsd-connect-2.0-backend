export const validateLength = function (min, max) {
  return function (propertyName) {
    return propertyName.length >= min && propertyName.length <= max
  }
}

export const setDate = function (propertyName) {
  return function (next) {
    this[propertyName] = Date.now()
    next()
  }
}
