const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bootcamp = require("../../app/Model/Bootcamp");
const Course = require("../../app/Model/Course");
const User = require("../../app/Model/User");
const Review = require("../../app/Model/Review");
const path = "../../../config/config.env";

dotenv.config({ path });

// COnnect to DB
mongoose.connect("mongodb://127.0.0.1:27017/dev-camper-express", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync("../../../data/bootcamps.json"));
const courses = JSON.parse(fs.readFileSync("../../../data/courses.json"));
const users = JSON.parse(fs.readFileSync("../../../data/users.json"));
const reviews = JSON.parse(fs.readFileSync("../../../data/reviews.json"));

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		await Review.create(reviews);
		console.log("Data Imported...");
		process.exit();
	} catch (error) {
		console.log(error.message);
		process.exit();
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log("Data deleted...");
		process.exit();
	} catch (error) {
		console.log("Error while deleting data ...");
		process.exit();
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
