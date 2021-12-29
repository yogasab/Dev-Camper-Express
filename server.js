const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./src/routes/bootcamps");
const logger = require("./src/app/Http/middleware/logger");
const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT;

connectDB();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);
app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV}`);
});
