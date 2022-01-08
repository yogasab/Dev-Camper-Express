const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const bootcamps = require("./src/routes/bootcamps");
const courses = require("./src/routes/courses");
const auth = require("./src/routes/auth");
const users = require("./src/routes/users");
const reviews = require("./src/routes/reviews");
const handleError = require("./src/app/Http/middleware/handleError");
const connectDB = require("./env/db");

dotenv.config({ path: "./env/config.env" });

const app = express();
const PORT = process.env.PORT;

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// File Upload
app.use(fileUpload());
// Cookie parser
app.use(cookieParser());
// SQL injector
app.use(mongoSanitize());
// Headers protection
app.use(helmet());
// XSS attack
app.use(xss());
// Setting rate limit for amount of request
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 3,
});
app.use(limiter);
// HPP attack
app.use(hpp());
// CORS Attack
app.use(cors());

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/users", users);
app.use("/api/v1/reviews", reviews);

// Handle Error Middleware
app.use(handleError);

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV}`);
});
