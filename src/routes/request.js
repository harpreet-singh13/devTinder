const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.get("/sentConnectionRequest", userAuth, async (req, res) => {
	const user = req.user;
	console.log(user);
	res.send(user.firstName + " " + " Sent the connection request");
});

module.exports = requestRouter;
