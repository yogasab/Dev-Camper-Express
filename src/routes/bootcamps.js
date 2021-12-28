const express = require("express");
const router = express.Router();
const {
	createBootcamp,
	getBootcamps,
	getBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require("../app/Http/controllers/bootcamps");

router.route("/").get(getBootcamps).post(createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
