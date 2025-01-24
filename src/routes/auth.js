const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
	try {
		// Validation of data
		validateSignUpData(req);

		const { firstName, lastName, emailId, password } = req.body;

		// password encrypt
		const hashPassword = await bcrypt.hash(password, 10);
		// console.log(hashPassword);

		// creating a new instance of the user model
		const user = new User({
			firstName,
			lastName,
			emailId,
			password: hashPassword,
		});

		await user.save();
		res.send("User added Sucessfully");
	} catch (err) {
		res.status(400).send(
			"Getting error while adding the user : " + err.message
		);
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error("Invalid Credentials");
		}

		const isValidPassword = await user.validatePassword(password);

		if (isValidPassword) {
			const token = await user.getJWT();
			res.cookie("token", token, {
				expires: new Date(Date.now() + 8 * 3600000),
			});
			res.send("Login Successfully!");
		} else {
			throw new Error("Invalid Credentials");
		}
	} catch (err) {
		res.status(400).send("ERROR : " + err.message);
	}
});

module.exports = authRouter;
