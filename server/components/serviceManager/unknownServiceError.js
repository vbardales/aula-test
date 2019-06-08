export default class UnknownServiceError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, UnknownServiceError); // relocate stack trace out of this constructor
    this.code = 'UNKNOWN_SERVICE';
    this.statusCode = 404;
  }
}
