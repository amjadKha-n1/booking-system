module.exports.up = (pgm) => {
  pgm.sql(`
        ALTER TABLE bookings
        ALTER COLUMN status
        SET DEFAULT 'pending';
    `);
};

module.exports.down = (pgm) => {
  pgm.sql(`
        ALTER TABLE bookings
        ALTER COLUMN status
        SET DEFAULT 'confirmed';
    `);
};
