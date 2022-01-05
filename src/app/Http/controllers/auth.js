const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const User = require("../../Model/User");

// @decs    Create/Store new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncMiddleware(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	const token = user.getSignedJWTToken();

	res.status(201).json({ success: true, data: user, token });
});

// @decs    Create/Store registered user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncMiddleware(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorResponse("Email and password must be filled", 400));
	}
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}
	const isPasswordMatch = await user.matchPassword(password);
	if (!isPasswordMatch) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}
	const token = user.getSignedJWTToken();

	res
		.status(200)
		.json({ success: true, message: "User logged in successfully", token });
});
