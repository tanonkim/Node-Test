const { DATABASE_ERROR } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");
const appDataSource = require("./appDataSource");

const getAllposts = async () => {
  try {
    return await appDataSource.query(
      `
      SELECT 
            u.id as userId, 
            u.profile_image as userProfileImage, 
            p.id as postingId, 
            p.image_url as postingImageUrl, 
            content as postingContent
      FROM users as u
      LEFT JOIN posts p ON u.id = p.user_id
      `
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const checkExistPost = async (postId) => {
  try {
    return await appDataSource.query(
      `
        SELECT *
        FROM posts
        WHERE id = ?
      `,
      [postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const createPost = async (title, content, user_id) => {
  try {
    return await appDataSource.query(
      `
      INSERT INTO posts(title, content, user_id)
      VALUES (?, ?, ?);
    `,
      [title, content, user_id]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const saveImageUrl = async (postId, imageUrl, userId) => {
  try {
    return await appDataSource.query(
      `
      INSERT INTO PostImage (post_id, user_id, post_image_url)
      VALUES (?, ?, ?);
      `,
      [postId, userId, imageUrl]
    );
  } catch (error) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const deletePostById = async (postId) => {
  try {
    return await appDataSource.query(
      `
        DELETE
        FROM posts
        WHERE id = ?
      `,
      [postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

module.exports = {
  getAllposts,
  checkExistPost,
  createPost,
  saveImageUrl,
  deletePostById,
};
