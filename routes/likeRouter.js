const express = require("express");
const router = express.Router();

const likeController = require("../controllers/likeController");

try {
  router.post("/:userId/:postId", likeController.toggleLike);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
