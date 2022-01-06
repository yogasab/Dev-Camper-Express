const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Course = require("../../Model/Course");
const Bootcamp = require("../../Model/Bootcamp");

// @decs    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.getCourses = asyncMiddleware(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		res
			.status(200)
			.json({ success: true, totalCourses: courses.length, data: courses });
	} else {
		res.status(200).json(res.advanceResponseMiddleware);
	}
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
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found`), 404);
	}
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id ${req.user.id} is not authorized to add course to this bootcamp`,
				401
			)
		);
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
	if (course.user.toString() !== req.user && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id ${req.user.id} is not authorized to update course to this bootcamp`,
				401
			)
		);
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
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id ${req.user.id} is not authorized to update course to this bootcamp`,
				401
			)
		);
	}
	await course.remove();

	res.status(204).json({ success: true });
});
