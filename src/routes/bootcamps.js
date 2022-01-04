const express = require("express");
const {
	createBootcamp,
	getBootcamps,
	getBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
	uploadBootcampPhoto,
} = require("../app/Http/controllers/bootcamps");
const router = express.Router();
// Include others resource routers
const courseRouter = require("./courses");
const Bootcamp = require("../app/Model/Bootcamp");
const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsByRadius);

router.route("/:id/photo").put(uploadBootcampPhoto);

router
	.route("/")
	.get(advanceResponseMiddleware(Bootcamp, "courses"), getBootcamps)
	.post(createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
