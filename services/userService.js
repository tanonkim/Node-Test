const userDao = require("../models/userDao");

const signUp = async (name, email, profileImage, password) => {
  return userDao.createUser(name, email, profileImage, password);
};

const getPostsByUserId = async (userId) => {
  return userDao.getPostsByUserId(userId);
};

const processPosts = (rows) => {
  return rows.map((row) => ({
    postingId: row.postingId,
    postingImageUrl: row.postingImageUrl,
    postingContent: row.postingContent,
  }));
};

module.exports = { signUp, getPostsByUserId, processPosts };
