const baseResponseStatus = {
  SUCCESS: {
    key: "SUCCESS",
    statusCode: 200,
    errorCode: 1000,
    message: "요청에 성공하였습니다.",
  },
  INVALID_REQUEST: {
    key: "INVALID_REQUEST",
    statusCode: 400,
    errorCode: 2000,
    message: "잘못된 요청이 존재합니다.",
  },
};

module.exports = baseResponseStatus;
