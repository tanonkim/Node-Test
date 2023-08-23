const postService = require("../services/postService");
const baseResponse = require("../utils/baseResponse");
const { KEY_ERROR, NONE_POST } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");

const getAllposts = async (req, res) => {
  try {
    const rows = await postService.getAllposts();
    return baseResponse(rows, res);
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const imageUrls = req.uploadedFileUrls;

    if (!title || !content) {
      throw new CustomException(KEY_ERROR);
    }

    const postId = await postService.createPost(
      title,
      content,
      imageUrls,
      userId
    );

    return baseResponse({ postId: `${postId.insertId}` }, res);
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};

const deletePostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await postService.deletePostById(postId);

    if (result.success) {
      return baseResponse({ id: `${result.postData}` }, res);
    } else {
      throw new CustomException(NONE_POST);
    }
  } catch (error) {
    console.log(error);
    return baseResponse(error, res);
  }
};
module.exports = {
  getAllposts,
  createPost,
  deletePostById,
};
