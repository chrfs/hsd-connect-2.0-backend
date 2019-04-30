import { ValidationError } from "../errors";

export const schemaValidator = {
  validateLength(propertyName = "field", minLength = 0, maxLength = 0) {
    return async function(next: any) {
      try {
        if (!this.isNew && !this.isModified(propertyName)) return next();
        const isValid =
          this[propertyName].length >= minLength &&
          this[propertyName].length <= maxLength;
        if (!isValid) {
          throw ValidationError(
            propertyName,
            schemaValidatorMessages.invalidLength(
              propertyName,
              minLength,
              maxLength
            )
          );
        }
        return next();
      } catch (err) {
        throw err;
      }
    };
  },
  validateProperty(propertyName: string, fn: any, err: Error) {
    return async function(next: any) {
      try {
        if (!this.isNew && !this.isModified(propertyName)) return true;
        const isValid = await fn({ [propertyName]: this[propertyName] });
        if (!isValid) throw err;
        return next();
      } catch (err) {
        throw err;
      }
    };
  }
};

export const schemaUtils = {
  setPropertyDate(propertyName: string) {
    return function(next: any) {
      this[propertyName] = Date.now();
      next();
    };
  }
};

export const schemaValidatorMessages = {
  invalidLength: (propertyName = "field", minLength = 0, maxLength = 0) => {
    let err = `The ${propertyName} has to have a `;
    if (minLength && maxLength) {
      err += `length between ${minLength} and ${maxLength} characters.`;
    } else {
      err += minLength
        ? `min length of ${minLength} characters.`
        : `max length of ${maxLength} characters.`;
    }
    return err;
  },
  isRequired: (propertyName = "field") => {
    return `The ${propertyName} is required, please fill it out.`;
  }
};
