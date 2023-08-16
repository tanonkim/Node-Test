const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

try {
  router.post("/signup", userController.signUp);
  router.post("/signin", userController.signIn);
  router.get("/posts/:userId", userController.getPostsByUserId);
  router.patch("/:userId/posts/:postId", userController.updatePostByUserId);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
