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

// @decs    Update review details
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	let review = await Review.findById(id);
	if (!review) {
		return next(new ErrorResponse(`Review not found`, 404));
	}
	// If the user is not the one who create and not an admin
	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(`You are not authorized to update review`, 401)
		);
	}
	review = await Review.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});
	review.save();

	res
		.status(200)
		.json({ success: true, message: "Reviews updated successfully", review });
});

// @decs    Update review details
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;

	let review = await Review.findById(id);
	if (!review) {
		return next(new ErrorResponse(`Review not found`, 404));
	}
	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return nex(
			new ErrorResponse(`You are not authorized to update review`, 401)
		);
	}
	await review.remove();

	res
		.status(200)
		.json({ success: true, message: "Review deleted successfully" });
});
