const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./src/routes/bootcamps");
const courses = require("./src/routes/courses");
const handleError = require("./src/app/Http/middleware/handleError");
const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT;

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
connectDB();

app.use(express.json());
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
// Handle Error Middleware
app.use(handleError);

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV}`);
});
