const postDao = require("../models/postDao");

const getAllposts = async () => {
  return postDao.getAllposts();
};

const postInfo = async (postId) => {
  const postInfoQuery = await postDao.checkExistPost(postId);
  return postInfoQuery[0];
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

module.exports = { getAllposts, deletePostById };
