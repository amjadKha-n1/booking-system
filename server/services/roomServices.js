const { query } = require("express");
const pool = require("../db/index");

async function getRooms() {
  const result = await pool.query(
    `SELECT 
      r.id, 
      r.name, 
      r.description, 
      r.price_per_night, 
      r.capacity, 
      r.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', ri.id,
            'image_url', ri.image_url,
            'public_id', ri.public_id
          )
        ) FILTER (WHERE ri.id IS NOT NULL),
        '[]'
      ) as images
    FROM rooms r
    LEFT JOIN room_images ri ON r.id = ri.room_id
    GROUP BY r.id
    ORDER BY r.id`
  );

  return {
    success: true,
    rooms: result.rows,
  };
}

async function createRoom(name, description, pricePerNight, capacity) {
  const result = await pool.query(
    `
      INSERT INTO rooms (name, description, price_per_night, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
    [name, description, pricePerNight, capacity]
  );

  return { success: true, room: result.rows[0] };
}

async function updateRoom(id, name, description, pricePerNight, capacity) {
  // Start with base query
  let query = "UPDATE rooms SET ";
  const values = [];
  const updates = [];

  if (name !== undefined) {
    values.push(name);
    updates.push(`name = $${values.length}`);
  }
  if (description !== undefined) {
    values.push(description);
    updates.push(`description = $${values.length}`);
  }
  if (pricePerNight !== undefined) {
    values.push(pricePerNight);
    updates.push(`price_per_night = $${values.length}`);
  }
  if (capacity !== undefined) {
    values.push(capacity);
    updates.push(`capacity = $${values.length}`);
  }

  if (updates.length === 0) {
    return { success: false, message: "No fields to update" };
  }

  values.push(id);
  query += updates.join(", ") + ` WHERE id = $${values.length} RETURNING *`;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return { success: false, message: "Room not found" };
  }

  return { success: true, room: result.rows[0] };
}

async function deleteOneRoom(id) {
  const result = await pool.query(
    `
      DELETE FROM rooms WHERE id = $1
    `,
    [id]
  );
  if (result.rowCount === 0) {
    return { success: false, message: "No room found!" };
  }

  return { success: true, message: "Room has be successfully deleted!" };
}

async function saveRoomImages(roomId, files) {
  for (const file of files) {
    await pool.query(
      `
        INSERT INTO room_images (room_id, image_url, public_id)
        VALUES ($1, $2, $3)
        `,
      [roomId, file.path, file.filename]
    );
  }
  return { success: true, message: "Images upload successfully" };
}

module.exports = {
  updateRoom,
  deleteOneRoom,
  getRooms,
  createRoom,
  saveRoomImages,
};
