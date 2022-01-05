const jwt = require("jsonwebtoken");
const asyncMiddleware = require("./asyncMiddleware");
const ErrorResponse = require("../../../utils/ErrorResponse");
const User = require("../../Model/User");

exports.protect = asyncMiddleware(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		console.log(decoded);
		req.user = await User.findById(decoded.id);
	} catch (error) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}

	next();
});

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorize to access this route`,
					403
				)
			);
		}
		next();
	};
};
