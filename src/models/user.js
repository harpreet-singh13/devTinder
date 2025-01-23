const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid Email Address");
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (
					!validator.isStrongPassword(value, {
						minLength: 8,
						minLowercase: 1,
						minUppercase: 1,
						minNumbers: 1,
						minSymbols: 1,
					})
				) {
					throw new Error("Password is not Strong!");
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender data is not valid");
				}
			},
		},
		skills: {
			type: [String],
		},
		about: {
			type: String,
			default: "It is a default about",
		},
	},
	{ timestamps: true }
);

userSchema.methods.getJWT = async function () {
	const user = this;

	const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$029", {
		expiresIn: "7d",
	});

	return token;
};

userSchema.methods.validatePassword = async function (password) {
	const user = this;
	return await bcrypt.compare(password, user.password);
};

// const User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);
