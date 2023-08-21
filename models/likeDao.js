const { DATABASE_ERROR } = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");
const appDataSource = require("./appDataSource");

const isLikeExist = async (userId, postId) => {
  try {
    return await appDataSource.query(
      `
        SELECT EXISTS(SELECT *
          FROM likes
          WHERE user_id = ?
            AND post_id = ?) as 'LIKED'
      `,
      [userId, postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const postLike = async (userId, postId) => {
  try {
    return await appDataSource.query(
      `
        INSERT INTO likes(user_id, post_id)
        VALUES (?, ?)
      `,
      [userId, postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const deleteLike = async (userId, postId) => {
  try {
    return await appDataSource.query(
      `
        DELETE
        FROM likes
        WHERE user_id = ? and post_id = ?
      `,
      [userId, postId]
    );
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

module.exports = { isLikeExist, postLike, deleteLike };
