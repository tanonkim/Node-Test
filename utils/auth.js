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

    const decoded = jwt.verify(token, secretKey);
    const userEmail = await userService;

    req.email = decoded.email;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = loginReq;
