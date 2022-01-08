const express = require("express");
const {
	getReviews,
	getReview,
	createReview,
	updateReview,
	deleteReview,
} = require("../app/Http/controllers/reviews.js");
const Review = require("../app/Model/Review.js");
const router = express.Router({ mergeParams: true });

// Middleware
const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");
const { protect, authorize } = require("../app/Http/middleware/auth");

router
	.route("/")
	.get(
		advanceResponseMiddleware(Review, {
			path: "bootcamp",
			select: "name description",
		}),
		getReviews
	)
	.post(protect, authorize("user", "admin"), createReview);

router
	.route("/:id")
	.get(getReview)
	.put(protect, authorize("user", "admin"), updateReview)
	.delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
