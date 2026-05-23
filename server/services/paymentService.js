const pool = require("../db");

async function createPayment(bookingId, amount, paymentMethod) {
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
      message: "Booking not found!",
    };
  }

  const checkPayment = await pool.query(
    `
            SELECT * FROM payments
            WHERE id = $1
        `,
    [bookingId]
  );
  if (checkPayment.rows.length > 0) {
    return {
      success: false,
      message: "Payment already exists!",
    };
  }

  const result = await pool.query(
    `
        INSERT INTO payments (booking_id, amount, status, payment_method)
        VALUES ($1, $2, $3, $4)
    `,
    [bookingId, amount, "paid", paymentMethod]
  );

  return {
    success: true,
    payment: result.rows[0],
  };
}

module.exports = {
  createPayment,
};
