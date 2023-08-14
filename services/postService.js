const postDao = require("../models/postDao");

const getAllposts = async () => {
  return postDao.getAllposts();
};

module.exports = { getAllposts };
