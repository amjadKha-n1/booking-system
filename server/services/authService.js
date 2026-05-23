const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(name, email, password) {
  const userCheck = await pool.query(
    `
        SELECT * FROM users
        WHERE email = $1
    `,
    [email]
  );

  if (userCheck.rows.length > 0) {
    return { success: false, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
    `,
    [name, email, hashedPassword]
  );

  return { success: true, user: result.rows[0] };
}

async function loginUser(email, password) {
  const result = await pool.query(
    `
        SELECT * FROM users 
        WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return { success: false, message: "Invalid credentials!" };
  }

  const user = result.rows[0];

  const isMatching = await bcrypt.compare(password, user.password);
  if (!isMatching) {
    return { success: false, message: "Invalid credentials!" };
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    },
  };
}

module.exports = { registerUser, loginUser };
