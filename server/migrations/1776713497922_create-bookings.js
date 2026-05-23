module.exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE bookings (
            id SERIAL PRIMARY KEY,
            
            user_id INT NOT NULL,
            room_id INT NOT NULL,
            
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
    
            status TEXT DEFAULT 'pending',
    
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
            CONSTRAINT fk_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,
    
            CONSTRAINT fk_room
                FOREIGN KEY (room_id)
                REFERENCES rooms(id)
                ON DELETE CASCADE,
            
            CONSTRAINT valid_dates
                CHECK (end_date > start_date)
        );

        CREATE INDEX idx_bookings_room_id ON bookings(room_id);
        CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
    `);
};

module.exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE bookings;
    `);
};
