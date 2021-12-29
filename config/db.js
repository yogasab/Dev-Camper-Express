const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			"mongodb://127.0.0.1:27017/dev-camper-express",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log(`MongoDB Connected to ${conn.connection.host}`);
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = connectDB;
