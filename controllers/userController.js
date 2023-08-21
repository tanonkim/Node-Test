const userService = require("../services/userService");
const baseResponse = require("../utils/baseResponse");
const { KEY_ERROR } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");

const signUp = async (req, res, next) => {
  try {
    const { name, email, profileImage, password } = req.body;

    if (!name || !email || !password || !profileImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
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
    const processedPosts = userService.processPosts(rows);

    res.status(200).json({
      data: {
        userId: rows[0].userId,
        userProfileImage: rows[0].userProfileImage,
        postings: processedPosts,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePostByUserId = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const { content } = req.body;

    const rows = await userService.updatePostContent(userId, postId, content);

    res.status(200).json({ data: rows });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  getPostsByUserId,
  updatePostByUserId,
};
