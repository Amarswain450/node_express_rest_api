class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "email or password is wrong!") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "unAuthorized") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "NotFound...") {
    return new CustomErrorHandler(401, message);
  }

  static serverError(message = "Internal server error") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
