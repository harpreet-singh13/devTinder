const express = require("express");

const app = express();

app.use("/test", (req, res) => {
	res.send("Hello from test");
});
app.use((req, res) => {
	res.send("Hello from the server!");
});

app.listen(3000, () => {
	console.log("Server is sucessfully listen on 3000");
});
