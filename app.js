/* Open UI5 services */

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");

const appConfig = require('./appConfig');

const app = module.exports = express();


/* Set some app specific environment variables */
for(var prop in appConfig) {
	app.set(prop, appConfig[prop]);
}


/* Setup the app middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));


// Connect to the Mongo database.
const sDatabaseUrl = "mongodb://" + app.get("MONGO_user") + ":" + app.get("MONGO_password") + "@"
					+ app.get("MONGO_server") + ":" + app.get("MONGO_port") + "/" + app.get("MONGO_database");
mongoose.connect(sDatabaseUrl);


// Append the access control header to all incomming requests.
app.use(function(req, res, next) {
	// Allow Cross Origin Resoource Sharing.
	req.header("Access-Control-Allow-Origin", "*");

	// Handle browser pre-flight requests.
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, DELETE");
		return res.status(200).json({}); // Short-circuit the request
	}
	next();
});


// Set all of the service routes (data) for the app models.
const aDataRoutes = fs.readdirSync(__dirname + "/models");
aDataRoutes.forEach(function(filename) {
	if (filename.indexOf(".js") > 0) {
		const route = require(__dirname + "/routes/data/" + filename);
		app.use("/data/" + filename.split(".js")[0], route);
	}
});


// Make the OpenUI5 libraries publicly accessible (everything in the ./public directory).
app.use(express.static(path.join(__dirname, "public")));


// Set the default UI route.
const launchpadRoute = require("./routes/launchpad");
app.use("/", launchpadRoute);


module.exports = app;