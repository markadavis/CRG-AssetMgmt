const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
	try {
		// const sToken = req.headers.x-access-token;
		const sToken = req.cookies.CRGLjwtToken;
		const decodedToken = jwt.verify(sToken, req.app.get("JWT_secret"));
		next();
	} catch (err) {
		return res.status(401).json({
			message: "Not Authorized."
		});
		// return res.redirect("/login");
	}
};