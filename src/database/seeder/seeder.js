const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bootcamp = require("../../app/Model/Bootcamp");
const Course = require("../../app/Model/Course");
const { CONNREFUSED } = require("dns");

const path = "../../../config/config.env";
// require("../../../data/bootcamps.js");

dotenv.config({ path });

// COnnect to DB
mongoose.connect("mongodb://127.0.0.1:27017/dev-camper-express", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync("../../../data/bootcamps.json"));
const courses = JSON.parse(fs.readFileSync("../../../data/courses.json"));

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
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
