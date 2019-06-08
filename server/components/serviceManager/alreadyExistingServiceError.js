export default class AlreadyExistingServiceError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, AlreadyExistingServiceError); // relocate stack trace out of this constructor
    this.code = 'ALREADY_EXISTING_SERVICE';
    this.statusCode = 400;
  }
}
