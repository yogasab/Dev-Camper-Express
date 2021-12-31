const NodeGeocoder = require("node-geocoder");

const options = {
	provider: "mapquest",
	httpAdapter: "https",
	apiKey: "sqUZlX2E9vF0hk4NftqgjuMu1tbxodEU",
	formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
