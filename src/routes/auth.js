const express = require("express");
const {
	register,
	login,
	getProfile,
} = require("../../src/app/Http/controllers/auth");
const { protect } = require("../app/Http/middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);

module.exports = router;
