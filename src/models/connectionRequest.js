const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: User,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: User,
		},
		status: {
			type: String,
			require: true,
			ennum: {
				values: ["ignore", "interested", "accepted", "rejected"],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	// check if the fromUserId is same as toUserId
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
		throw new Error("Cannot send connection request to yourself!!");
	}
	next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
