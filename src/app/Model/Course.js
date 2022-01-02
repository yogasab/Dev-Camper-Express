const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please add a title course"],
		trim: true,
	},
	description: {
		type: String,
		required: [true, "Please add number of weeks"],
	},
	weeks: {
		type: String,
		required: [true, "Please add number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add tuition cost"],
	},
	minimumSkill: {
		type: String,
		required: [true, "Please add number of weeks"],
		enum: ["beginner", "intermediate", "advance"],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
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
});

module.exports = mongoose.model("Course", CourseSchema);
