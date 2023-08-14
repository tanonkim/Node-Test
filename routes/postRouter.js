const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

try {
  router.get("", postController.getAllposts);
  router.delete("/:postId", postController.deletePostById);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
