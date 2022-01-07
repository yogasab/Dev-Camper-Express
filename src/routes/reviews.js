const express = require("express");
const { getReviews, getReview } = require("../app/Http/controllers/reviews.js");
const Review = require("../app/Model/Review.js");
const router = express.Router();

// Middleware
const advanceResponseMiddleware = require("../app/Http/middleware/advanceResponseMiddleware");
const { protect } = require("../app/Http/middleware/auth");

router.route("/").get(
	advanceResponseMiddleware(Review, {
		path: "bootcamp",
		select: "name description",
	}),
	getReviews
);

router.route("/:id").get(getReview);

module.exports = router;
