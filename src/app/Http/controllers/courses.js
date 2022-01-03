const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Course = require("../../Model/Course");

// @decs    Get course
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.getCourses = asyncMiddleware(async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		// Defining the relationship
		query = Course.find().populate({
			path: "bootcamp",
			select: "name description",
		});
	}
	const courses = await query;

	res
		.status(200)
		.json({ success: true, totalCourses: courses.length, data: courses });
});
