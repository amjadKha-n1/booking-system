const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const validate = require("../middleware/validate");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
