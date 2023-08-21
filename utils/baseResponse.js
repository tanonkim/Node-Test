const baseResponseStatus = require("./baseResponseStatus");
const CustomException = require("./handler/customException");

const baseResponse = (dataOrError, res) => {
  if (dataOrError instanceof CustomException) {
    return res.status(200).json({
      isSuccess: dataOrError.isSuccess,
      responseCode: dataOrError.responseCode,
      responseMessage: dataOrError.responseMessage,
    });
  }

  // 데이터 반환 처리
  if (dataOrError) {
    return res.status(200).json({
      isSuccess: baseResponseStatus.SUCCESS.isSuccess,
      responseCode: baseResponseStatus.SUCCESS.responseCode,
      responseMessage: baseResponseStatus.SUCCESS.responseMessage,
      data: dataOrError,
    });
  }

  // 그 외의 에러 처리
  return res.status(500).json({
    responseCode: 5000,
    message: "서버 내부 오류",
  });
};

module.exports = baseResponse;
