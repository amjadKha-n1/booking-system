const express = require("express");

const router = express.Router();

const isAdmin = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get(
  "/all-bookings",
  authMiddleware,
  isAdmin,
  adminController.getAllBookings
);
router.post(
  "/createRoom",
  authMiddleware,
  isAdmin,
  adminController.createRooms
);
router.post(
  "/rooms/:roomId/images",
  authMiddleware,
  isAdmin,
  upload.array("images", 5),
  adminController.uploadRoomImages
);
router.patch(
  "/updateRoom/:id",
  authMiddleware,
  isAdmin,
  adminController.updateRoom
);
router.patch(
  "/bookings/:id/status",
  authMiddleware,
  isAdmin,
  adminController.updateBookingStatusController
);
router.delete(
  "/deleteRoom/:id",
  authMiddleware,
  isAdmin,
  adminController.deleteRoom
);

module.exports = router;
