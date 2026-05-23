const { registerUser, loginUser } = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUser(name, email, password);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
