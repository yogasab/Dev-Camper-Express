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

	sendTokenResponse(user, 200, res);

	// const token = user.getSignedJWTToken();
	// res.status(201).json({ success: true, data: user, token });
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

	sendTokenResponse(user, 200, res);
	// const token = user.getSignedJWTToken();
	// res
	// 	.status(200)
	// 	.json({ success: true, message: "User logged in successfully", token });
});

const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJWTToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.TOKEN_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie("cookie", token, options)
		.json({ success: true, token });
};
