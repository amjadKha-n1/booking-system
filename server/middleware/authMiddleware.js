const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role || "user" };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
}

module.exports = authMiddleware;
