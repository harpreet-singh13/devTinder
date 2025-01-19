const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://01sharpreet:CiZpno7u8yrkZ7mF@cluster0.jt6rc.mongodb.net/devTinder"
	);
};

module.exports = connectDB;