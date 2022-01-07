const express = require("express");
const {
	register,
	login,
	getProfile,
	forgotPassword,
	resetPassword,
} = require("../../src/app/Http/controllers/auth");
const { protect } = require("../app/Http/middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, getProfile);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
