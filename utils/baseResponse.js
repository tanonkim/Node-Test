const CustomException = require("./handler/customException");

const baseResponse = (err, req, res, next) => {
  if (err instanceof CustomException) {
    return res.status(err.statusCode).json({
      isSuccess: err.isSuccess,
      responseCode: err.responseCode,
      statusCode: err.statusCode,
      responseMessage: err.responseMessage,
    });
  }

  return res.status(500).json({
    responseCode: 5000,
    message: "서버 내부 오류",
  });
};

module.exports = baseResponse;
