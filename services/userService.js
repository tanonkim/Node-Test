const userDao = require("../models/userDao");
const bcrypt = require("bcrypt");
const { emailRegex, passwordRegex } = require("../utils/regex");

const signUp = async (name, email, profileImage, password) => {
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

  const saltRound = 12;
  const hashedPassword = await bcrypt.hash(password, saltRound);

  return userDao.createUser(name, email, profileImage, hashedPassword);
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
