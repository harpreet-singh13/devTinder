const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validate");
const sendEmail = require("../utils/nodeMailer"); // Import the sendEmail function
const User = require("../models/user");
const nodemailer = require("nodemailer");

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

    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send(savedUser);
  } catch (err) {
    res
      .status(400)
      .send("Getting error while adding the user : " + err.message);
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
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully!!");
});

authRouter.post("/forgotPassword", async (req, res) => {
  const { emailId } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save the reset token to the user document
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
    const emailSubject = "Password Reset";
    const emailHtml = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    await sendEmail(user.emailId, emailSubject, emailHtml);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in /forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the user's password
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = authRouter;
