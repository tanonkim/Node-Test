const likeDao = require("../models/likeDao");
const postDao = require("../models/postDao");
const { NONE_POST } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");

const isLikeExist = async (userId, postId) => {
  return await likeDao.isLikeExist(userId, postId);
};

const toggleLike = async (userId, postId) => {
  const postExist = await postDao.checkExistPost(postId);
  if (!postExist[0]) {
    throw new CustomException(NONE_POST);
  }

  const favorite = await isLikeExist(userId, postId);

  if (favorite[0].LIKED == 0) {
    await likeDao.postLike(userId, postId);
    return { liked: true };
  } else {
    await likeDao.deleteLike(userId, postId);
    return { liked: false };
  }
};

module.exports = { isLikeExist, toggleLike };
