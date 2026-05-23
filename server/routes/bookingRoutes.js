const express = require("express");
const router = express.Router();

const bookingsController = require("../controllers/bookingsController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { bookingSchema } = require("../validations/bookingValidation");

router.post(
  "/",
  authMiddleware,
  validate(bookingSchema),
  bookingsController.createBookingsController
);

module.exports = router;
