const {
  createRoom,
  updateRoom,
  deleteOneRoom,
  saveRoomImages,
} = require("../services/roomServices");

const { updateBookingStatus } = require("../services/adminBookingService");
const { getbookings } = require("../services/bookingServices");
exports.createRooms = async (req, res) => {
  try {
    const { name, description, pricePerNight, capacity } = req.body;
    const result = await createRoom(name, description, pricePerNight, capacity);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { name, description, pricePerNight, capacity } = req.body;
    const result = await updateRoom(
      req.params.id,
      name,
      description,
      pricePerNight,
      capacity
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const result = await deleteOneRoom(req.params.id);
    res.status(201).json({
      message: "Room is deleted!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const result = await getbookings();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadRoomImages = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const files = req.files;
    const result = await saveRoomImages(roomId, files);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatusController = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const result = await updateBookingStatus(bookingId, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
