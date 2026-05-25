module.exports.up = (pgm) => {
  pgm.sql(`
      ALTER TABLE users
      ADD COLUMN role TEXT DEFAULT 'user';
    `);
};

module.exports.down = (pgm) => {
  pgm.sql(`
      ALTER TABLE users
      DROP COLUMN role;
    `);
};
