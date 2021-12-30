const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bootcamp = require("../../app/Model/Bootcamp");

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

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log("Data Imported...");
		process.exit();
	} catch (error) {
		console.log("Error while inserting data ...");
		process.exit();
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
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
