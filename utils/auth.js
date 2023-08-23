const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const userService = require("../services/userService");
const CustomException = require("./handler/customException");
const { INVALID_USER } = require("./baseResponseStatus");

const loginReq = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      const error = new Error("NO_AUTHORIZATION_IN_HEADER");
      error.statusCode = 401;
      throw error;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (e) {
      const error = new Error("INVALID_TOKEN");
      error.statusCode = 401;
      throw error;
    }

    const userData = await userService.findUserIdByEmail(decoded.userId);

    if (!userData) {
      const error = new Error("INVALID_USER");
      error.statusCode = 401;
      throw error;
    }

    req.userId = userData.id;
    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const validateUserId = (req, res, next) => {
  try {
    const { userId } = req.params;
    const userIdFromToken = req.userId;

    if (parseInt(userId) !== userIdFromToken) {
      const error = new Error("INVALID_USER");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { loginReq, validateUserId };
