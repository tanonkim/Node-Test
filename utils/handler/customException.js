const baseResponseStatus = require("../baseResponseStatus");

function CustomException(errorEnum) {
  const errorDetail = baseResponseStatus[errorEnum.key];

  if (!errorDetail) {
    throw new Error("Invalid Error Enum");
  }

  this.isSuccess = errorDetail.isSuccess;
  this.responseMessage = errorDetail.responseMessage;
  this.statusCode = errorDetail.statusCode;
  this.responseCode = errorDetail.responseCode;
  // this.stack = new Error().stack;
}

CustomException.prototype = Object.create(Error.prototype);
CustomException.prototype.constructor = CustomException;

module.exports = CustomException;
