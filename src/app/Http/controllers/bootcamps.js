// @decs    Create/Store bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
	res.status(201).json({ success: true, data: "Create/Store a new bootcamp" });
};

// @decs    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({ success: true, data: "Show all available bootcamps" });
};

// @decs    Get detail bootcamp
// @route   GET /api/v1/bootcamps?:id (int)
// @access  Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Show single data from bootcamps ${req.params.id}`,
	});
};

// @decs    Update bootcamp
// @route   PUT /api/v1/bootcamps?:id (int)
// @access  Private
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Update single data from bootcamps ${req.params.id}`,
	});
};

// @decs    Delete bootcamp
// @route   DELETE /api/v1/bootcamps?:id (int)
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Delete single data from bootcamps ${req.params.id}`,
	});
};
