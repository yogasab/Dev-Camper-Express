const ErrorResponse = require("../../../utils/ErrorResponse");

const handleError = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	if (err.name === "CastError") {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404);
	}

	if (err.code === 11000) {
		const message = `Error duplicate value ${err.keyValue.name}`;
		error = new ErrorResponse(message, 400);
	}

	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map((value) => value.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode).json({
		success: false,
		message: error.message,
	});
};

module.exports = handleError;
