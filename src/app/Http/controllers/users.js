const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const User = require("../../Model/User");

// @decs    Create/Store new user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = asyncMiddleware(async (req, res, next) => {
	const user = await User.create(req.body);

	res
		.status(201)
		.json({ success: true, message: "User created successfully", user });
});

// @decs    GET all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncMiddleware(async (req, res, next) => {
	res.status(200).json(res.advanceResponseMiddleware);
});

// @decs    Update all users
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;

	const user = await User.findByIdAndUpdate(id, body, {
		new: true,
		runValidators: true,
	});

	res
		.status(200)
		.json({ success: true, message: "User updated successfully", user });
});

// @decs    GET user details
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	const user = await User.findById(id).select("-password");
	if (!user) {
		return next(new ErrorResponse(`User not found`, 404));
	}

	res.status(200).json({ success: true, user });
});

// @decs    Update all users
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	const user = await User.findByIdAndDelete(id);

	res.status(200).json({ success: true, message: "User deleted successfully" });
});
