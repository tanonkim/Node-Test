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

module.exports = { signUp };
