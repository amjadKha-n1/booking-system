const { getRooms } = require("../services/roomServices");

exports.getAllRooms = async (req, res) => {
  try {
    const result = await getRooms();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
