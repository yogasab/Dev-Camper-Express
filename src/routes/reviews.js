const express = require("express");
const {
	getReviews,
	getReview,
	createReview,
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

router.route("/:id").get(getReview);

module.exports = router;
