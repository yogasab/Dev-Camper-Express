const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const bootcamps = require("./src/routes/bootcamps");
const courses = require("./src/routes/courses");
const auth = require("./src/routes/auth");
const handleError = require("./src/app/Http/middleware/handleError");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT;

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(cookieParser());

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

// Handle Error Middleware
app.use(handleError);

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV}`);
});
