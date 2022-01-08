const crypto = require("crypto");
const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const User = require("../../Model/User");
const sendEmail = require("../../../utils/SendEmail");

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

// @decs    Get the current user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getProfile = asyncMiddleware(async (req, res, next) => {
	console.log(req.user);
	const user = await User.findById(req.user.id);

	res.status(200).json({ success: true, data: user });
});

// @decs    Forgot password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.forgotPassword = asyncMiddleware(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return next(new ErrorResponse(`User with email ${email} not found`, 404));
	}

	// Create reset password
	const resetPasswordToken = user.getResetPassword();
	// Create reset URL
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/reset-password/${resetPasswordToken}`;
	const message = `Your reset password is ${resetURL}`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password reset token",
			message,
		});

		res.status(200).json({ success: true, message: "Email sent successfully" });
	} catch (error) {
		console.log(error);

		user.resetPasswordToken = undefined;
		user.resetPasswordToken = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse(`Email could not be send`, 500));
	}

	await user.save({ validateBeforeSave: false });

	res.status(200).json({ success: true, data: user });
});

// @decs    Forgot password
// @route   POST /api/v1/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncMiddleware(async (req, res, next) => {
	const { resetToken } = req.params;

	// Get hashed token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	// Find user by hashed token and expire token
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});
	if (!user) {
		return next(new ErrorResponse(`User not found`, 400));
	}
	user.password = req.body.password;
	user.resetPassword = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// @decs    Update user name and email
// @route   POST /api/v1/auth/update-details
// @access  Private
exports.updateUserDetails = asyncMiddleware(async (req, res, next) => {
	const { id } = req.user;
	const fields = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await User.findByIdAndUpdate(req.user.id, fields, {
		new: true,
		runValidators: true,
	});

	res
		.status(200)
		.json({ success: true, message: "User info successfully updated", user });
});

// @decs    Update user password
// @route   POST /api/v1/auth/update-password
// @access  Private
exports.updatePassword = asyncMiddleware(async (req, res, next) => {
	const { id } = req.user;
	const { currentPassword, newPassword } = req.body;

	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorResponse(`User with id ${id} not found`, 401));
	}
	if (!(await user.matchPassword(currentPassword))) {
		return next(new ErrorResponse(`Invalid credentials`, 401));
	}
	user.password = newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// @decs    Logout and clear the token cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncMiddleware(async (req, res, next) => {
	res.cookie("cookie", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({ success: true, message: "User logout successfully" });
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
