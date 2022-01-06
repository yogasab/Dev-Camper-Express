const ErrorResponse = require("../../../utils/ErrorResponse");
const geocoder = require("../../../utils/Geocoder");
const Bootcamp = require("../../Model/Bootcamp");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const path = require("path");

// @decs    Create/Store bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncMiddleware(async (req, res, next) => {
	req.body.user = req.user.id;

	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
	if (publishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`The user with ID of ${req.user.id} has published bootcamp`,
				400
			)
		);
	}
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({ success: true, data: bootcamp });
});

// @decs    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncMiddleware(async (req, res, next) => {
	res.status(200).json(res.advanceResponseMiddleware);
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

	let bootcamp = await Bootcamp.findById(id);
	console.log(bootcamp.user);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found`, 404));
	}
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to updated this bootcamp`,
				401
			)
		);
	}
	bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

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

	const bootcamp = await Bootcamp.findById(id);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found`, 404));
	}
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to updated this bootcamp`,
				401
			)
		);
	}
	bootcamp.remove();

	res.status(204).json({
		success: true,
		message: "Bootcamp deleted successfully",
	});
});

// @decs    Get bootcamp within radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsByRadius = asyncMiddleware(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	const radius = distance / 6378;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @decs    Update/Upload bootcamp image
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadBootcampPhoto = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	const bootcamp = await Bootcamp.findById(id);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found`, 404));
	}
	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to updated this bootcamp`,
				401
			)
		);
	}
	const file = req.files.photo;
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse(`Please upload a image file`, 400));
	}
	if (!file.size > 1000000) {
		return next(
			new ErrorResponse(`Please upload a image file less than 1MB`, 400)
		);
	}
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.BOOTCAMP_PATH_PHOTO}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(
				new ErrorResponse(`There are problems when uploading image`, 500)
			);
		}

		await Bootcamp.findByIdAndUpdate(id, { photo: file.name });
		res.status(201).json({
			success: true,
			message: "Image uploaded successfully",
			file: file.name,
		});
	});

	// res.status(204).json({
	// 	success: true,
	// 	message: "Bootcamp deleted successfully",
	// });
});
