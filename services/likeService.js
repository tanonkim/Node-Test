const likeDao = require("../models/likeDao");

const isLikeExist = async (userId, postId) => {
  return likeDao.isLikeExist(userId, postId);
};

const toggleLike = async (userId, postId) => {
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
