const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Course = require("../../Model/Course");
const Bootcamp = require("../../Model/Bootcamp");

// @decs    Get courses
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

// @decs    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	const course = await Course.findById(id);
	if (!course) {
		return next(new ErrorResponse(`Course not found`), 404);
	}

	res.status(200).json({ success: true, data: course });
});

// @decs    Create course related to bootcamp
// @route   GET /api/v1/bootcamps/:bootcampId(ObjectID)/courses
// @access  Private
exports.createCourse = asyncMiddleware(async (req, res, next) => {
	const { bootcampId } = req.params;
	req.body.bootcamp = bootcampId;

	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found`), 404);
	}
	const course = await Course.create(req.body);

	res.status(201).json({ success: true, data: course });
});

// @decs    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	let course = await Course.findById(id);
	if (!course) {
		return next(new ErrorResponse(`Course not found`), 404);
	}
	course = await Course.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: course });
});

// @decs    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	let course = await Course.findById(id);
	if (!course) {
		return next(new ErrorResponse(`Course not found with id of ${id}`));
	}
	await course.remove();

	res.status(204).json({ success: true });
});
