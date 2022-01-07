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
const reviewRouter = require("./reviews");
const Bootcamp = require("../app/Model/Bootcamp");
const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");
const { protect, authorize } = require("../app/Http/middleware/auth");

router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsByRadius);

router
	.route("/:id/photo")
	.put(protect, authorize("publisher", "admin"), uploadBootcampPhoto);

router
	.route("/")
	.get(advanceResponseMiddleware(Bootcamp, "courses"), getBootcamps)
	.post(protect, createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(protect, authorize("publisher", "admin"), updateBootcamp)
	.delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
