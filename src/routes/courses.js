const express = require("express");
const { getCourses } = require("../app/Http/controllers/courses");
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);

module.exports = router;
