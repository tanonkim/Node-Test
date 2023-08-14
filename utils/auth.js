const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const loginReq = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      next(err);
    }

    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { loginReq };
