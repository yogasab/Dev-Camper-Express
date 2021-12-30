const ErrorResponse = require("../../../utils/ErrorResponse");
const Bootcamp = require("../../Model/Bootcamp");
const asyncMiddleware = require("../middleware/asyncMiddleware");

// @decs    Create/Store bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncMiddleware(async (req, res, next) => {
	const bootcamp = req.body;
	const data = await Bootcamp.create(bootcamp);
	res.status(201).json({ success: true, data: data });
});

// @decs    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncMiddleware(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();
	res.status(200).json({
		success: true,
		totalBootcamp: bootcamps.length,
		data: bootcamps,
	});
});

// @decs    Get detail bootcamp
// @route   GET /api/v1/bootcamps?:id (int)
// @access  Public
exports.getBootcamp = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const bootcamp = await Bootcamp.findById(id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`)
		);
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @decs    Update bootcamp
// @route   PUT /api/v1/bootcamps?:id (int)
// @access  Private
exports.updateBootcamp = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp) {
		return res.status(400).json({ success: false });
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @decs    Delete bootcamp
// @route   DELETE /api/v1/bootcamps?:id (int)
// @access  Private
exports.deleteBootcamp = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const bootcamp = await Bootcamp.findByIdAndDelete(id);
	if (!bootcamp) {
		return res.status(400).json({ success: false });
	}
	res.status(204).json({
		success: true,
		message: "Bootcamp deleted successfully",
	});
});
