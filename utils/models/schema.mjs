const schemaUtils = {}

schemaUtils.validateLength = function (min, max) {
  return function (propertyName) {
    return propertyName.length >= min && propertyName.length <= max
  }
}

schemaUtils.setRecordDate = function (propertyName) {
  return function (next) {
    this[propertyName] = Date.now()
    next()
  }
}

export default schemaUtils
