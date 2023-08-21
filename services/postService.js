const postDao = require("../models/postDao");

const getAllposts = async () => {
  return postDao.getAllposts();
};

const postInfo = async (postId) => {
  const postInfoQuery = await postDao.checkExistPost(postId);
  return postInfoQuery[0];
};

const createPost = async (title, content, image_url, user_id) => {
  try {
    return postDao.createPost(title, content, image_url, user_id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletePostById = async (postId) => {
  const postData = await postInfo(postId);

  if (postData) {
    postDao.deletePostById(postId);
    return { success: true, postData: postData.id };
  } else {
    return { success: false };
  }
};

module.exports = {
  getAllposts,
  createPost,
  deletePostById,
};
