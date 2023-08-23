const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

const postController = require("../controllers/postController");
const { imageUploader, uploadToS3 } = require("../utils/s3/imageUploader");

try {
  router.get("", postController.getAllposts);
  router.post(
    "",
    auth.loginReq,
    imageUploader,
    uploadToS3,
    postController.createPost
  );
  router.delete("/:postId", postController.deletePostById);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
