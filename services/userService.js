const userDao = require("../models/userDao");

const signUp = async (name, email, profileImage, password) => {
  const emailRegex =
    /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!emailRegex.test(email)) {
    const error = new Error("NOT_VALID_EMAIL_REGEX");
    error.statusCode = 400;
    throw error;
  }

  if (!passwordRegex.test(password)) {
    const error = new Error("NOT_VALID_PASSWORD_REGEX");
    error.statusCode = 400;
    throw error;
  }

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
