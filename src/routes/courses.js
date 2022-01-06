const express = require("express");
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../app/Http/controllers/courses");
const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");
const { protect, authorize } = require("../app/Http/middleware/auth");
const Course = require("../app/Model/Course");
const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advanceResponseMiddleware(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(protect, createCourse);

router
	.route("/:id")
	.get(getCourse)
	.put(protect, authorize("publisher", "admin"), updateCourse)
	.delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
