const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

try {
  router.get("", postController.getAllposts);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
