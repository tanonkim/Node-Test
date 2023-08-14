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

const updatePostContent = async (userId, postId, content) => {
  try {
    userDao.updatePostContent(userId, postId, content);
    return userDao.getUpdatedPost(userId, postId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signUp,
  getPostsByUserId,
  processPosts,
  updatePostContent,
};
