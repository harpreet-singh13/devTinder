const adminAuth = (req, res, next) => {
	console.log("Admin Auth is getting checked!!");
	const token = "xyz";
	const isAdminAuthorized = token === "xz";

	if (!isAdminAuthorized) {
		res.status(401).send("Unauthorized Request");
	} else {
		next();
	}
};

const userAuth = (req, res, next) => {
	console.log("User Auth is getting checked!!");
	const token = "xyz";
	const isUserAuthorized = token === "xyz";

	if (!isUserAuthorized) {
		res.status(401).send("Unauthorized Request");
	} else {
		next();
	}
};

module.exports = {
	adminAuth,
	userAuth,
};
