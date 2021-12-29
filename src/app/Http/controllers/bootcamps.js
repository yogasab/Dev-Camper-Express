// @decs    Create/Store bootcamp
// @route   POST /api/v1/bootcamps

const ErrorResponse = require("../../../utils/ErrorResponse");
const Bootcamp = require("../../Model/Bootcamp");

// @access  Private
exports.createBootcamp = async (req, res, next) => {
	const bootcamp = req.body;
	try {
		const data = await Bootcamp.create(bootcamp);
		res.status(201).json({ success: true, data: data });
	} catch (error) {
		res.status(400).json({ success: false, data: error.message });
	}
};

// @decs    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			success: true,
			totalBootcamp: bootcamps.length,
			data: bootcamps,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// @decs    Get detail bootcamp
// @route   GET /api/v1/bootcamps?:id (int)
// @access  Public
exports.getBootcamp = async (req, res, next) => {
	const { id } = req.params;
	try {
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
	} catch (error) {
		// res.status(404).json({ success: false });
		next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`));
	}
};

// @decs    Update bootcamp
// @route   PUT /api/v1/bootcamps?:id (int)
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
	const { id } = req.params;
	try {
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
	} catch (error) {
		res.status(404).json({ success: false });
	}
};

// @decs    Delete bootcamp
// @route   DELETE /api/v1/bootcamps?:id (int)
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
	const { id } = req.params;
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(id);
		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}
		res.status(204).json({
			success: true,
			message: "Bootcamp deleted successfully",
		});
	} catch (error) {}
	res.status(400).json({
		success: false,
	});
};
