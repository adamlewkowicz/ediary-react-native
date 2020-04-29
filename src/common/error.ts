import { ABORT_ERROR_NAME } from './consts';

export class UserIdCannotBeNullError extends Error {}

export class EntityValidationError extends Error {}

export class FetchifyError extends Error {}

export class AbortError extends Error {
  constructor(message: string = ABORT_ERROR_NAME) {
    super(message);
  }
}