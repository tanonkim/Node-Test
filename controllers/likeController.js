const likeService = require("../services/likeService");

const toggleLike = async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const result = await likeService.toggleLike(userId, postId);

    if (result.liked) {
      res.status(200).json({ message: "likeCreated" });
    } else {
      res.status(200).json({ message: "likesDeleted" });
    }
  } catch (err) {
    return res.status(err.statusCode || 500).json({ messgae: err.message });
  }
};

module.exports = { toggleLike };
