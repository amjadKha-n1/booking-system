const pool = require("../db");
const { all } = require("../routes/adminRoutes");

async function updateBookingStatus(bookingId, status) {
  const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!allowedStatuses.includes(status)) {
    return {
      success: false,
      message: "Invalid booking status",
    };
  }

  const checkBooking = await pool.query(
    `
        SELECT * FROM bookings
        WHERE id = $1
    `,
    [bookingId]
  );

  if (checkBooking.rows.length === 0) {
    return {
      success: false,
      message: "No booking found!",
    };
  }

  const result = await pool.query(
    `
        UPDATE bookings
        SET status = $1
        WHERE id = $2
        RETURNING *
    `,
    [status, bookingId]
  );

  return {
    success: true,
    booking: result.rows[0],
  };
}

module.exports = {
  updateBookingStatus,
};
