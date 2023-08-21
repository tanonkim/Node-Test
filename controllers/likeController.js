const likeService = require("../services/likeService");
const baseResponse = require("../utils/baseResponse");

const toggleLike = async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const result = await likeService.toggleLike(userId, postId);

    if (result.liked) {
      return baseResponse("likeCreated", res);
    } else {
      return baseResponse("likesDeleted", res);
    }
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

module.exports = { toggleLike };
