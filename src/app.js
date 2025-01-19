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
