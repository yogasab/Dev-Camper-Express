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

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageRating: { $avg: "$rating" },
			},
		},
	]);
	console.log(obj);
	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageRating,
		});
	} catch (error) {
		console.log(error);
	}
};

ReviewSchema.post("save", async function () {
	await this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre("remove", async function () {
	await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
