const handleError = (err, req, res, next) => {
	console.log(err.stack);
	res.status(500).json({
		success: false,
		message: err.message,
	});
};

module.exports = handleError;
