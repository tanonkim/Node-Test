const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

try {
  router.post("/signup", userController.signUp);
} catch (error) {
  console.log(error);
}

module.exports = {
  router,
};
