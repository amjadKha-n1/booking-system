exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL, 
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE users;
    `);
};
