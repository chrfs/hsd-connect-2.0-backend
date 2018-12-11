import { ValidationError } from '../../utils/errors'

export const projectValidatorErrors = {
  uniqueTitle: new ValidationError(
    'title',
    'A project with this title already exists.'
  )
}
