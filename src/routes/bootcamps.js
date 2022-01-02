const express = require("express");
const {
	createBootcamp,
	getBootcamps,
	getBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
} = require("../app/Http/controllers/bootcamps");
const router = express.Router();
// Include others resource routers
const courseRouter = require("./courses");

router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsByRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
