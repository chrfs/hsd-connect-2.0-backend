import { ValidationError } from "../errors";

export const projectValidatorErrors = {
  uniqueTitle: ValidationError(
    "title",
    "A project with this title already exists."
  )
};
