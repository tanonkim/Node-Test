const appDataSource = require("./appDataSource");

const createUser = async (name, email, profileImage, password) => {
  try {
    return await appDataSource.query(
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
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
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
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = { createUser, getPostsByUserId };
