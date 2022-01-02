const ErrorResponse = require("../../../utils/ErrorResponse");
const geocoder = require("../../../utils/Geocoder");
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
	let query;

	// Grab all the query params object
	const reqQuery = { ...req.query };
	// Define select query key object to modify
	const removedFields = ["select", "sort", "limit", "page"];
	// Delete each key on select array to grab the value only
	removedFields.forEach((param) => delete reqQuery[param]);
	// Create query string
	let queryStr = JSON.stringify(req.query);

	// Create separators (gt|gte|lt|lte|in)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// Finding resource
	query = Bootcamp.find(JSON.parse(queryStr));
	// Select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	// Sort fields
	if (req.query.sort) {
		const fields = req.query.sort.split(",").join(" ");
		query = query.sort(fields);
	} else {
		query = query.sort("-createdAt");
	}

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 1;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Pagination Result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	// Executing query
	const bootcamps = await query;

	res.status(200).json({
		pagination,
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
