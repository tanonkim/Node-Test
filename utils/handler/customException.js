const baseResponseStatus = require("../baseResponseStatus");

function customException(errorEnum) {
  const errorDetail = baseResponseStatus[errorEnum.key];
  if (!errorDetail) {
    throw new Error("Invalid Error Enum");
  }

  this.name = "customException";
  this.message = errorDetail.message;
  this.statusCode = errorDetail.statusCode;
  this.errorCode = errorDetail.errorCode;
  this.stack = new Error().stack;
}

customException.prototype = Object.create(Error.prototype);
customException.prototype.constructor = customException;

module.exports = customException;
