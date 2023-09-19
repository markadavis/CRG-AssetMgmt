/* Launchpad Page route handler */

const express = require("express");
const path = require('path');
const verifyToken = require("../middleware/verifytoken");
const router = express.Router();


/* =================== */
/*  GET the home page  */
/* =================== */
router.get("/", verifyToken, function(req, res, next) {
    //res.render("index");
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
