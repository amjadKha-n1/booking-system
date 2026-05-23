module.exports.up = (pgm) => {
  pgm.sql(`
      CREATE TABLE rooms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price_per_night NUMERIC(10,2) NOT NULL,
        capacity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
};

module.exports.down = (pgm) => {
  pgm.sql(`
      DROP TABLE rooms;
    `);
};
