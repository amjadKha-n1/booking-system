module.exports.up = (pgm) => {
  pgm.sql(`
      
      CREATE TABLE payments (
  
        id SERIAL PRIMARY KEY,
  
        booking_id INT UNIQUE NOT NULL,
  
        amount NUMERIC(10, 2) NOT NULL,
  
        status TEXT DEFAULT 'pending',
  
        payment_method TEXT,
  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
        CONSTRAINT fk_payment_booking
          FOREIGN KEY (booking_id)
          REFERENCES bookings(id)
          ON DELETE CASCADE
  
      );
  
    `);
};

module.exports.down = (pgm) => {
  pgm.sql(`
      DROP TABLE payments;
    `);
};
