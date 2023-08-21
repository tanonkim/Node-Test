const userDao = require("../models/userDao");
const bcrypt = require("bcrypt");
const { emailRegex, passwordRegex } = require("../utils/regex");
const jwt = require("jsonwebtoken");
const customException = require("../utils/handler/customException");
const {
  INVALID_REQUEST,
  INVALID_EMAIL_OR_PASSWORD,
  DUPLICATED_EMAIL,
  NONE_POST,
} = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");
const secretKey = process.env.SECRET_KEY;

const signUp = async (name, email, profileImage, password) => {
  if (!emailRegex.test(email)) {
    throw new customException(INVALID_REQUEST);
  }

  if (!passwordRegex.test(password)) {
    throw new customException(INVALID_REQUEST);
  }

  if (await userDao.findUserIdByEmail(email)) {
    throw new customException(DUPLICATED_EMAIL);
  }

  const saltRound = 12;
  const hashedPassword = await bcrypt.hash(password, saltRound);

  return userDao.createUser(name, email, profileImage, hashedPassword);
};

const signIn = async (email, password) => {
  try {
    const user = await findUserIdByEmail(email);

    if (!user) {
      throw new customException(INVALID_EMAIL_OR_PASSWORD);
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new customException(INVALID_EMAIL_OR_PASSWORD);
    }

    const payload = { userId: user.email };
    const token = jwt.sign(payload, secretKey, { expiresIn: "6h" });

    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
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
    const post = await userDao.getPostByIdAndUserId(userId, postId);

    if (!post || post.length === 0) {
      throw new CustomException(NONE_POST);
    }

    await userDao.updatePostContent(userId, postId, content);
    return await userDao.getUpdatedPost(userId, postId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserIdByEmail = async (email) => {
  try {
    return await userDao.findUserIdByEmail(email);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signUp,
  signIn,
  getPostsByUserId,
  processPosts,
  updatePostContent,
  findUserIdByEmail,
};
