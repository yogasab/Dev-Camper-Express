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
	user: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageCost: { $avg: "$tuition" },
			},
		},
	]);

	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (error) {
		console.log(error);
	}
};

CourseSchema.post("save", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre("remove", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
