const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const userService = require("../services/userService");
const CustomException = require("./handler/customException");
const {
  INVALID_USER,
  NO_AUTHORIZATION_IN_HEADER,
  INVALID_TOKEN_TYPE,
} = require("./baseResponseStatus");

const loginReq = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new CustomException(NO_AUTHORIZATION_IN_HEADER);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (e) {
      throw new CustomException(INVALID_TOKEN_TYPE);
    }

    const userData = await userService.findUserIdByEmail(decoded.userId);

    if (!userData) {
      throw new CustomException(INVALID_USER);
    }

    req.userId = userData.id;
    next();
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(200).json({
        isSuccess: error.isSuccess,
        responseMessage: error.responseMessage,
        responseCode: error.responseCode,
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const validateUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userIdFromToken = req.userId;

    if (parseInt(userId) !== userIdFromToken) {
      throw new CustomException(INVALID_USER);
    }
    next();
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(200).json({
        isSuccess: error.isSuccess,
        responseMessage: error.responseMessage,
        responseCode: error.responseCode,
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { loginReq, validateUserId };
