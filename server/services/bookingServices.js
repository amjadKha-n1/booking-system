const pool = require("../db/index");

async function createBookings(userId, roomId, startDate, endDate) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const checkQuery = `
            SELECT * FROM bookings
            WHERE room_id = $1
            AND STATUS = 'confirmed'
            AND (
                start_date < $3
                AND end_date > $2
            )
        `;

    const result = await client.query(checkQuery, [roomId, startDate, endDate]);
    if (result.rows.length > 0) {
      await client.query("ROLLBACK");
      return { success: false, message: "Room not available" };
    }

    const insertQuery = `
            INSERT INTO bookings (user_id, room_id, start_date, end_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
    const booking = await client.query(insertQuery, [
      userId,
      roomId,
      startDate,
      endDate,
    ]);

    await client.query("COMMIT");

    return { success: true, booking: booking.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Releases connection back to pool
    client.release();
  }
}

async function getbookings() {
  const result = await pool.query(`
        SELECT 
            b.*,
            u.name as user_name,
            r.name as room_name,
            p.status as payment_status,
            p.amount as payment_amount,
            p.payment_method
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN rooms r ON b.room_id = r.id
        LEFT JOIN payments p ON b.id = p.booking_id
        ORDER BY b.created_at DESC
    `);

  return {
    success: true,
    bookings: result.rows,
  };
}
module.exports = { createBookings, getbookings };
