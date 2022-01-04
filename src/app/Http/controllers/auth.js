const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const User = require("../../Model/User");

// @decs    Create/Store new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncMiddleware(async (req, res, next) => {
	res.status(200).json({ success: true });
});
