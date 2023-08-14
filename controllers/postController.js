const postService = require("../services/postService");

const getAllposts = async (req, res) => {
  try {
    const rows = await postService.getAllposts();
    res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(err.statusCode || 500).json({ messgae: err.message });
  }
};
module.exports = { getAllposts };
