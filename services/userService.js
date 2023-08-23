const userDao = require("../models/userDao");
const postDao = require("../models/postDao");
const bcrypt = require("bcrypt");
const { emailRegex, passwordRegex } = require("../utils/regex");
const jwt = require("jsonwebtoken");
const customException = require("../utils/handler/customException");
const {
  INVALID_REQUEST,
  INVALID_EMAIL_OR_PASSWORD,
  DUPLICATED_EMAIL,
  NONE_POST,
} = require("../utils/baseResponseStatus");
const CustomException = require("../utils/handler/customException");
const { deleteImageFromS3, uploadToS3 } = require("../utils/s3/imageUploader");
const secretKey = process.env.SECRET_KEY;

const signUp = async (name, email, profileImage, password) => {
  if (!emailRegex.test(email)) {
    throw new customException(INVALID_REQUEST);
  }

  if (!passwordRegex.test(password)) {
    throw new customException(INVALID_REQUEST);
  }

  if (await userDao.findUserIdByEmail(email)) {
    throw new customException(DUPLICATED_EMAIL);
  }

  const saltRound = 12;
  const hashedPassword = await bcrypt.hash(password, saltRound);

  return userDao.createUser(name, email, profileImage, hashedPassword);
};

const signIn = async (email, password) => {
  try {
    const user = await findUserIdByEmail(email);

    if (!user) {
      throw new customException(INVALID_EMAIL_OR_PASSWORD);
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new customException(INVALID_EMAIL_OR_PASSWORD);
    }

    const payload = { userId: user.email };
    const token = jwt.sign(payload, secretKey, { expiresIn: "6h" });

    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPostsByUserId = async (userId) => {
  return userDao.getPostsByUserId(userId);
};

const processPosts = (rows) => {
  let postMap = new Map();

  rows.forEach((row) => {
    if (postMap.has(row.postingId)) {
      const post = postMap.get(row.postingId);
      post.postingImageUrl.push(row.postingImageUrl);
    } else {
      postMap.set(row.postingId, {
        postingId: row.postingId,
        postingImageUrl: [row.postingImageUrl],
        postingContent: row.postingContent,
      });
    }
  });

  return [...postMap.values()];
};

const updatePostContent = async (userId, postId, content, updatedUrls) => {
  try {
    const post = await userDao.getPostByIdAndUserId(userId, postId);

    if (!post || post.length === 0) {
      throw new CustomException(NONE_POST);
    }

    if (updatedUrls.length) {
      const existingImages = await userDao.getImagesByPostId(postId); // 해당 포스트의 기존 이미지 URL 가져오기
      for (let image of existingImages) {
        await deleteImageFromS3(image.post_image_url); // S3에서 기존 이미지를 삭제
        await userDao.deleteImageRecord(image.id); // PostImage 테이블에서 기존 이미지 레코드를 삭제
      }

      // DB 업데이트
      for (const imageUrl of updatedUrls) {
        await postDao.saveImageUrl(postId, imageUrl, userId);
      }
    }
    await userDao.updatePostContent(userId, postId, content);

    return await userDao.getUpdatedPost(userId, postId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserIdByEmail = async (email) => {
  try {
    return await userDao.findUserIdByEmail(email);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  signUp,
  signIn,
  getPostsByUserId,
  processPosts,
  updatePostContent,
  findUserIdByEmail,
};
