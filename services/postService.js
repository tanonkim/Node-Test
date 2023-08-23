const postDao = require("../models/postDao");

const getAllposts = async () => {
  return postDao.getAllposts();
};

const postInfo = async (postId) => {
  const postInfoQuery = await postDao.checkExistPost(postId);
  return postInfoQuery[0];
};

const createPost = async (title, content, imageUrls, user_id) => {
  try {
    const postResult = await postDao.createPost(title, content, user_id); // 첫 번째 imageUrl은 null로 설정

    const postId = postResult.insertId;

    for (const imageUrl of imageUrls) {
      await postDao.saveImageUrl(postId, imageUrl, user_id);
    }

    return postResult;
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
