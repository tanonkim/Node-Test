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
      `SELECT u.id    as userId,
      u.profile_image as userProfileImage,
      p.id            as postingId,
      p.image_url     as postingImageUrl,
      p.content       as postingContent
      FROM users      as u
      LEFT JOIN posts as p
      ON u.id = p.user_id
      WHERE u.id = ?
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
  getUpdatedPost,
  findUserIdByEmail,
  getPostByIdAndUserId,
};
