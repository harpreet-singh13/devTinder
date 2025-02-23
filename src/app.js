const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV || "dev"}`),
});

console.log(process.env.FRONTEND_URL);

const cors = require("cors");
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(process.env.PORT, () => {
      console.log("Server is sucessfully listen on 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
