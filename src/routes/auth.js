const express = require("express");
const {
	register,
	login,
	getProfile,
	forgotPassword,
	resetPassword,
	updateUserDetails,
	updatePassword,
	logout,
} = require("../../src/app/Http/controllers/auth");
const { protect } = require("../app/Http/middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, getProfile);
router.put("/reset-password/:resetToken", resetPassword);
router.put("/update-details", protect, updateUserDetails);
router.put("/update-password", protect, updatePassword);

module.exports = router;
