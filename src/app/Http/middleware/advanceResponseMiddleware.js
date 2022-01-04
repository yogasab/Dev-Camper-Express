const advanceResponseMiddleware =
	(model, populate) => async (req, res, next) => {
		let query;
		// Grab all the query params object
		const reqQuery = { ...req.query };
		// Define select query key object to modify
		const removedFields = ["select", "sort", "limit", "page"];
		// Delete each key on select array to grab the value only
		removedFields.forEach((param) => delete reqQuery[param]);
		// Create query string
		let queryStr = JSON.stringify(req.query);
		// Create separators (gt|gte|lt|lte|in)
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		// Finding resource
		// query = model.find(JSON.parse(queryStr)).populate({
		// 	path: "courses",
		// 	select: "title description",
		// });
		query = model.find(JSON.parse(queryStr));
		// Select fields
		if (req.query.select) {
			const fields = req.query.select.split(",").join(" ");
			query = query.select(fields);
		}
		// Sort fields
		if (req.query.sort) {
			const fields = req.query.sort.split(",").join(" ");
			query = query.sort(fields);
		} else {
			query = query.sort("-createdAt");
		}
		// Pagination
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 1;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await model.countDocuments();
		query = query.skip(startIndex).limit(limit);

		if (populate) {
			query = query.populate(populate);
		}
		// Pagination Result
		const pagination = {};
		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}
		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}
		// Executing query
		const results = await query;

		res.advanceResponseMiddleware = {
			success: true,
			count: model.length,
			pagination,
			data: results,
		};

		next();
	};

module.exports = advanceResponseMiddleware;
