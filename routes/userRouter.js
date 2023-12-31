const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { uploadToS3, imageUploader } = require("../utils/s3/imageUploader");
const auth = require("../utils/auth");

try {
  router.post("/signup", userController.signUp);
  router.post("/signin", userController.signIn);
  router.get("/posts/:userId", userController.getPostsByUserId);
  router.patch(
    "/:userId/posts/:postId",
    auth.loginReq,
    auth.validateUserId,
    imageUploader,
    uploadToS3,
    userController.updatePostByUserId
  );
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
