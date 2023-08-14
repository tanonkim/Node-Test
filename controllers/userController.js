const userService = require("../services/userService");

const signUp = async (req, res) => {
  try {
    const { name, email, profileImage, password } = req.body;

    if (!name || !email || !password || !profileImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    await userService.signUp(name, email, profileImage, password);

    res.status(201).json({ message: "User_Created" });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ messgae: error.message });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const rows = await userService.getPostsByUserId(userId);
    const processedPosts = userService.processPosts(rows);

    res.status(200).json({
      data: {
        userId: rows[0].userId,
        userProfileImage: rows[0].userProfileImage,
        postings: processedPosts,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updatePostByUserId = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const { content } = req.body;

    const rows = await userService.updatePostContent(userId, postId, content);

    res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { signUp, getPostsByUserId, updatePostByUserId };
