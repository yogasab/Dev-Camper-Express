const ErrorResponse = require("../../../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Review = require("../../Model/Review");
const Bootcamp = require("../../Model/Bootcamp");

// @decs    GET all reviews that related to bootcamp
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncMiddleware(async (req, res, next) => {
	const { bootcampId } = req.params;
	if (bootcampId) {
		const reviews = await Review.find({ bootcamp: bootcampId });
		if (!reviews) {
			return next(new ErrorResponse(`Review not found`, 404));
		}
		res.status(200).json({ success: true, data: reviews });
	} else {
		res.status(200).json(res.advanceResponseMiddleware);
	}
});

// @decs    GET review details
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	const review = await Review.findById(id).populate({
		path: "bootcamp",
		select: "name description",
	});
	if (!review) {
		return next(new ErrorResponse(`Review not found`, 404));
	}

	res.status(200).json({ success: true, data: review });
});

// @decs    Create/Store new reviews for related bootcamp
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.createReview = asyncMiddleware(async (req, res, next) => {
	const { bootcampId } = req.params;
	const { body } = req;
	// Bootcamp
	req.body.bootcamp = bootcampId;
	// User
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found`, 404));
	}
	const review = await Review.create(body);

	res
		.status(201)
		.json({ success: true, message: "Review created successfully", review });
});
