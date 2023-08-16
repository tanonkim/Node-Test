const express = require("express");
const router = express.Router();
const loginReq = require("../utils/auth");

const postController = require("../controllers/postController");

try {
  router.get("", postController.getAllposts);
  router.post("", loginReq, postController.createPost);
  router.delete("/:postId", postController.deletePostById);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
