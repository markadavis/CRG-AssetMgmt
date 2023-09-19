/* User maintenance & authentication route handler */

const UserModel = require("../../models/user.js");

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const verifytoken = require("../../middleware/verifytoken");
const router = express.Router();



/* ===================================== */
/*  GEG  - Verify the current JWT token  */
/* ===================================== */
router.get("/verifyToken", function(req, res, next) {
	try {
		// const sToken = req.headers.x-access-token;
		const sToken = req.cookies.CRGLjwtToken;
		const decodedToken = jwt.verify(sToken, req.app.get("JWT_secret"));

		UserModel.find({
			userId: decodedToken.userId
		}).exec().then(function(user) {
			res.status(200).json({
				message: "User Authorized.",
				user: {
					userId: user[0].userId,
					email: user[0].email
				}
			});
		}).catch(function(error) {
			console.log(error);
			res.status(500).json({
				message: error
			});
		});

	} catch (err) {
		return res.status(401).json({
			message: "Not Authorized."
		});
	}
});



/* ============================ */
/*  POST  - Create an new User  */
/* ============================ */
router.post("/add", verifytoken, function(req, res, next) {
	UserModel.find({
		userId: req.body.userId
	}).exec().then(function(user) {
		if (user.length > 0) {
			return res.status(433).json({
				message: "User exists."
			});
		} else {
			bcrypt.hash(req.body.password, 10, function(err, hash){
				if (err) {
					return res.status(500).json({
						message: err
					});
				} else {
					const user = new UserModel({
						userId: req.body.userId,
						email: req.body.email,
						password: hash
					});
					user.save().then(function(result) {
						res.status(201).json({
							message: "User Created."
						});
					}).catch(function(error) {
						console.log(error);
						res.status(500).json({
							message: error
						});
					});
				}
			});
		}
	});
});

/* ======================================= */
/*  POST  - Authenticate an existing User  */
/* ======================================= */
router.post("/authenticate", function(req, res, next) {
	UserModel.find({
		userId: req.body.userId
	}).exec().then(function(user) {
		if (user.length < 1) {
			// console.error(jwt.verify(req.cookies.CRGLjwtToken, req.app.get("JWT_secret")));
			return res.status(401).json({
				message: "Invalid User and/or Password." + user
			});
		} else {
			bcrypt.compare(req.body.password, user[0].password, function(error, bHashMatch) {
				if (error || !bHashMatch) {
					res.status(401).json({
						message: "Invalid User and/or Password."
					});
				} else {
					const sToken = jwt.sign(
						{userId: user[0].userId},
						req.app.get("JWT_secret"),
						{expiresIn: req.app.get("JWT_timeout")}
					);

					// res.header("x-access-token", sToken);
					res.cookie('CRGLjwtToken', sToken, { maxAge: req.app.get("AuthtokenTimeout"), httpOnly: true });

					res.status(200).json({
						message: "User Authorized.",
						user: {
							userId: user[0].userId,
							email: user[0].email
						}
					});
				}
			});
		}
	}).catch(function(error) {
		console.log(error);
		res.status(500).json({
			message: error
		});
	});
});

/* ===================================== */
/*  POST  - Revoke an existing JWT token */
/* ===================================== */
router.post("/revokeToken", verifytoken, function(req, res, next) {
	res.cookie("CRGLjwtToken", "", { maxAge: 10});
	res.status(200).json({
		message: "Token invalidated."
	});
});




/* =================================== */
/*  DELETE  - Remove an existing User  */
/* =================================== */
router.delete("/remove", verifytoken, function(req, res, next) {
	UserModel.remove({
		userId: req.body.userId
		// email: req.body.email
	}).exec().then(function(result) {
		res.status(200).json({
			message: "User deleted.",
			data: result
		});
	}).catch(function(error) {
		console.log(error);
		res.status(500).json({
			message: error
		});
	});
});


module.exports = router;