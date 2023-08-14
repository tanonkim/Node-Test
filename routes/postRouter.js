const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

try {
  router.get("", postController.getAllposts);
  router.post("/:userId", postController.createPost);
  router.delete("/:postId", postController.deletePostById);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
