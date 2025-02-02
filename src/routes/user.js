const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested",
		}).populate(
			"fromUserId",
			"firstName lastName age gender skills about photoUrl"
		);

		res.json({
			message: "Connection Request are fetched",
			data: connectionRequests,
		});
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connections = await ConnectionRequest.find({
			$or: [
				{ toUserId: loggedInUser._id },
				{ fromUserId: loggedInUser._id },
			],

			status: "accepted",
		}).populate(
			"fromUserId",
			"firstName lastName age gender skills about photoUrl"
		).populate("toUserId" , "firstName lastName age gender skills about photoUrl");

		const data = connections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }else {
                return row.fromUserId;
            }
        });

		res.json({ data });
	} catch (err) {
		res.status(400).send("ERROR :" + err.message);
	}
});
module.exports = userRouter;
