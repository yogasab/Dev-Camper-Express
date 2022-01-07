const express = require("express");
const {
	createUser,
	getUsers,
	updateUser,
	getUser,
	deleteUser,
} = require("../../src/app/Http/controllers/users");
const User = require("../app/Model/User");
const router = express.Router();

const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");
const { protect, authorize } = require("../app/Http/middleware/auth");

router.use(protect);
router.use(authorize("admin"));

router
	.route("/")
	.post(createUser)
	.get(advanceResponseMiddleware(User), getUsers);

router.route("/:id").put(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
