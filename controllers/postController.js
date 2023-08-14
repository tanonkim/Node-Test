const postService = require("../services/postService");

const getAllposts = async (req, res) => {
  try {
    const rows = await postService.getAllposts();
    res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(err.statusCode || 500).json({ messgae: err.message });
  }
};

const deletePostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await postService.deletePostById(postId);

    if (result.success) {
      return res.status(200).json({ message: `${result.postData} Deleted` });
    } else {
      res.status(404).json({ message: `Post with ID not found : ${postId}` });
    }
  } catch (error) {
    return res.status(err.statusCode || 500).json({ messgae: err.message });
  }
};
module.exports = { getAllposts, deletePostById };
