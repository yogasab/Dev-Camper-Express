const express = require("express");
const { register } = require("../../src/app/Http/controllers/auth");
const router = express.Router();

router.post("/register", register);

module.exports = router;
