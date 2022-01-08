const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please add a title for review"],
		trim: true,
		maxlength: 1000,
	},
	description: {
		type: String,
		required: [true, "Please add a description"],
	},
	rating: {
		type: Number,
		required: [true, "Please add a rating between 1 to 10"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Types.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
