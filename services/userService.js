const userDao = require("../models/userDao");

const signUp = async (name, email, profileImage, password) => {
  return userDao.createUser(name, email, profileImage, password);
};

module.exports = { signUp };
