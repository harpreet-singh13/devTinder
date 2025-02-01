const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
	"/request/send/:status/:toUserId",
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			const allowedStatus = ["ignored", "interested"];

			if (!allowedStatus.includes(status)) {
				// res.status(400).send("Invalid status type");
				throw new Error("Invalid status type");
			}
			
			const toUser = await User.findById(toUserId);
			
			if (!toUser) {
				// res.status(404).json({ message: "User not found" });
				throw new Error("User not found");
			}
			
			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{ fromUserId, toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});
			
			if (existingConnectionRequest) {
				// res.status(400).send("Connection Already exist!");
				throw new Error("Connection request Already exist!!");
			}

			const connectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});

			const data = await connectionRequest.save();

			res.json({
				message: "Connection request is sent successfully!",
				data,
			});
		} catch (err) {
			res.status(400).send("ERROR : " + err.message);
		}
	}
);

module.exports = requestRouter;
