const baseResponseStatus = {
  SUCCESS: {
    key: "SUCCESS",
    isSuccess: true,
    responseCode: 1000,
    responseMessage: "요청에 성공하였습니다.",
  },

  /**
   * 2000 : Request 오류
   */

  INVALID_REQUEST: {
    key: "INVALID_REQUEST",
    isSuccess: false,
    responseCode: 2000,
    responseMessage: "잘못된 요청이 존재합니다.",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    key: "INVALID_EMAIL_ORPASSWORD",
    isSuccess: false,
    responseCode: 2000,
    responseMessage: "이메일 혹은 비밀번호가 잘못되었습니다.",
  },

  /**
   * 4000 : Database, Server 오류
   */
  DATABASE_ERROR: {
    key: "DATABASE_ERROR",
    isSuccess: false,
    responseCode: 4000,
    responseMessage: "데이터베이스 연결에 실패하였습니다.",
  },
  SERVER_ERROR: {
    key: "SERVER_ERROR",
    isSuccess: false,
    responseCode: 4001,
    responseMessage: "서버와의 연결에 실패하였습니다.",
  },
};

module.exports = baseResponseStatus;
