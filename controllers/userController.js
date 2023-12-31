const userService = require("../services/userService");
const baseResponse = require("../utils/baseResponse");
const { KEY_ERROR, NONE_POST } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");

const signUp = async (req, res, next) => {
  try {
    const { name, email, profileImage, password } = req.body;

    if (!name || !email || !password || !profileImage) {
      return CustomException(KEY_ERROR);
    }

    const userId = await userService.signUp(
      name,
      email,
      profileImage,
      password
    );

    return baseResponse({ userId }, res);
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomException(KEY_ERROR);
    }

    const token = await userService.signIn(email, password);
    return baseResponse({ accessToken: token }, res);
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const rows = await userService.getPostsByUserId(userId);
    if (rows.length === 0) {
      throw new CustomException(NONE_POST);
    }
    const processedPosts = userService.processPosts(rows);

    const data = {
      userId: rows[0].userId,
      userProfileImage: rows[0].userProfileImage,
      postings: processedPosts,
    };

    return baseResponse(data, res);
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

const updatePostByUserId = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const { content } = req.body;
    const imageUrl = req.uploadedFileUrls;

    const rows = await userService.updatePostContent(
      userId,
      postId,
      content,
      imageUrl
    );

    return baseResponse(rows, res);
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

module.exports = {
  signUp,
  signIn,
  getPostsByUserId,
  updatePostByUserId,
};
