module.exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE room_images (
            id SERIAL PRIMARY KEY,
            room_id INT NOT NULL,
            image_url TEXT NOT NULL,
            public_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_room_images_room
                FOREIGN KEY (room_id)
                REFERENCES rooms(id)
                ON DELETE CASCADE
        );
        CREATE INDEX idx_room_images_room_id
        ON room_images(room_id);
    `);
};

module.exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE room_images
    `);
};
