const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

const {
	validateEditProfileData,
	validateProfileForgotPasswordData,
} = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData(req)) {
			throw new Error("Invalid Edit Request Data");
		}

		const loggedInUser = req.user;
		console.log(loggedInUser);

		Object.keys(req.body).forEach((key) => {
			loggedInUser[key] = req.body[key];
		});

		await loggedInUser.save();
		console.log(loggedInUser);

		res.send({
			message: `${loggedInUser.firstName}, your profile is updated`,
			data: loggedInUser,
		});
	} catch (err) {
		res.status(400).send("ERROR : " + err.message);
	}
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
	try {
		if (!validateProfileForgotPasswordData(req)) {
			throw new Error("Invalid Edit request data");
		}

		const { newPassword, oldPassword } = req.body;

		const loggedInUser = req.user;
		const isValidPassword = await loggedInUser.validatePassword(
			oldPassword
		);

		if (!isValidPassword) {
			throw new Error("Old password in incorrect!!");
		}

		// password encrypt
		const hashPassword = await bcrypt.hash(newPassword, 10);

		console.log("New Hash Password " + hashPassword);
		loggedInUser.password = hashPassword;

		await loggedInUser.save();

		res.send({
			message: `${loggedInUser.firstName}, your password is changed.`,
			data: loggedInUser,
		});

		
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

module.exports = profileRouter;
