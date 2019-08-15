export class UserIdCannotBeNullError extends Error {}
export class UnsupportedUnitTypeError extends Error {}
export class TransactionManagerUndefinedError extends Error {
  constructor(message = 'Transaction manager is unavailable') {
    super();
  }
}