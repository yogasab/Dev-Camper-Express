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
