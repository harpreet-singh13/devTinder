const express = require("express");
const { validateSignUpData } = require("./utils/validate");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
	try {
		// Validation of data
		validateSignUpData(req);

		const { firstName, lastName, emailId, password } = req.body;

		// password encrypt
		const hashPassword = await bcrypt.hash(password, 10);
		console.log(hashPassword);

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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

app.get("/sentConnectionRequest", userAuth, async (req, res) => {
	const user = req.user;
	console.log(user);
	res.send(user.firstName + " " + "Connection request sent");
});

app.get("/user", async (req, res) => {
	try {
		const users = await User.find({ emailId: req.body.emailId });

		if (users.length === 0) {
			res.status(404).send("User not found");
		} else {
			res.send(users);
		}
	} catch (err) {
		res.status(401).send("Something went wrong!");
	}
});

app.get("/feed", async (req, res) => {
	try {
		const user = await User.find({});

		if (!user) {
			res.status(404).send("User not found");
		} else {
			res.send(user);
		}
	} catch (err) {
		res.status(401).send("Something went wrong!");
	}
});

app.delete("/user", async (req, res) => {
	const userId = req.body.userId;
	try {
		await User.findByIdAndDelete(userId);
		res.send("User deleted successfully!");
	} catch (err) {
		res.status(401).send("Something went wrong!");
	}
});

app.patch("/user/:userId", async (req, res) => {
	const userId = req.params.userId;
	const data = req.body;

	console.log(userId);
	console.log(data);

	try {
		const ALLOWED_UPDATES = ["about", "skills", "age", "gender"];

		const isUpdateAllowed = Object.keys(data).every((k) =>
			ALLOWED_UPDATES.includes(k)
		);

		if (!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}

		if (data?.skills.length > 10) {
			throw new Error("Skills cannot be more than 10");
		}

		const user = await User.findByIdAndUpdate(userId, data, {
			returnDocument: "after",
			runValidator: true,
		});

		console.log(user);
		res.send("User Updated successfully");
	} catch (err) {
		res.status(401).send("Something went wrong! " + err);
	}
});

connectDB()
	.then(() => {
		console.log("Database connection established!");
		app.listen(7777, () => {
			console.log("Server is sucessfully listen on 7777");
		});
	})
	.catch((err) => {
		console.error("Database cannot be connected!");
	});
