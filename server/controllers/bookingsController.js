const { createBookings } = require("../services/bookingServices");

exports.createBookingsController = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    const userId = req.user.id;
    const result = await createBookings(userId, roomId, startDate, endDate);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
