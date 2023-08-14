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
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
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
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
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
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = { getAllposts, checkExistPost, deletePostById };
