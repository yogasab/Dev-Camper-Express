const express = require("express");
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../app/Http/controllers/courses");
const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");
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
	.post(createCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
