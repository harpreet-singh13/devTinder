const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");

const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	// console.log(req.body);
	// creating a new instance of the user model
	const user = new User(req.body);

	try {
		await user.save();
		res.send("User added Sucessfully");
	} catch (err) {
		res.status(400).send(
			"Getting error while adding the user" + err.message
		);
	}
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
