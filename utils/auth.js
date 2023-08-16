const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const userService = require("../services/userService");

const loginReq = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      const error = new Error("NO_AUTHORIZATION_IN_HEADER");
      error.statusCode = 401;
      return next(error);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (e) {
      throw new Error("INVALID_TOKEN");
    }

    const userData = await userService.findUserIdByEmail(decoded.userId);

    if (!userData) {
      throw new Error("INVALID_USER");
    }

    req.userId = userData.id;
    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = loginReq;
