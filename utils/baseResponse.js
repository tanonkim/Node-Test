const CustomException = require("./handler/customException");

const baseResponse = (err, req, res, next) => {
  if (err instanceof CustomException) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    errorCode: 5000,
    message: "서버 내부 오류",
  });
};

module.exports = baseResponse;
