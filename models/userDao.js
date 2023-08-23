const { DATABASE_ERROR } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");
const appDataSource = require("./appDataSource");

const createUser = async (name, email, profileImage, password) => {
  try {
    await appDataSource.query(
      `
      INSERT INTO users(
      name,
      email, 
      profile_image,
      password
    ) VALUES (?, ?, ?, ?)
    `,
      [name, email, profileImage, password]
    );

    const result = await appDataSource.query(
      "SELECT LAST_INSERT_ID() as userId"
    );

    return result[0].userId;
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const findUserIdByEmail = async (email) => {
  try {
    const [data] = await appDataSource.query(
      `
      SELECT id, email, password
      FROM users
      WHERE email = ?;
      `,
      [email]
    );

    return data;
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const rows = await appDataSource.query(
      `
      SELECT 
          posts.user_id   AS userId,
          u.profile_image AS userProfileImage,
          posts.id        AS postingId,
          posts.title,
          posts.content AS postingContent,
          PostImage.post_image_url AS postingImageUrl
      FROM posts
      LEFT JOIN users u ON u.id = posts.user_id
      LEFT JOIN PostImage ON posts.id = PostImage.post_id
      WHERE posts.user_id = ?
      ORDER BY posts.id
      `,
      [userId]
    );
    return rows;
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const updatePostContent = async (userId, postId, content) => {
  try {
    return await appDataSource.query(
      `
        UPDATE posts
        SET content = ?
        WHERE user_id = ?
          AND id = ?
        `,
      [content, userId, postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const getImagesByPostId = async (postId) => {
  try {
    return await appDataSource.query(
      `
        SELECT * 
        FROM PostImage 
        WHERE post_id = ?
      `,
      [postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const deleteImageRecord = async (imageId) => {
  try {
    return await appDataSource.query(
      `
        DELETE FROM PostImage 
        WHERE id = ?
      `,
      [imageId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const getUpdatedPost = async (userId, postId) => {
  try {
    return await appDataSource.query(
      `
      SELECT p.user_id as userId, u.name, p.id as postingId, p.title as postingTitle, p.content as postingContent
      FROM posts as p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE user_id = ?
        AND p.id = ?
      `,
      [userId, postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const getPostByIdAndUserId = async (userId, postId) => {
  try {
    return await appDataSource.query(
      `
      SELECT id as postId
      FROM posts
      WHERE id = ?
        AND user_id = ?`,
      [postId, userId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

module.exports = {
  createUser,
  getPostsByUserId,
  updatePostContent,
  getImagesByPostId,
  deleteImageRecord,
  getUpdatedPost,
  findUserIdByEmail,
  getPostByIdAndUserId,
};
