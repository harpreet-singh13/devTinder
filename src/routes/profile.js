const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { parser } = require("../utils/cloudinary");
const multer = require("multer");

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

profileRouter.patch(
  "/profile/edit",
  userAuth,
  parser.single("image"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      // Validate non-file data
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request Data");
      }

      // Handle file upload if present
      let uploadResponse = null;
      if (req.file) {
        // console.log("File upload details:", {
        //   originalname: req.file.originalname,
        //   size: req.file.size,
        //   url: req.file.path,
        //   public_id: req.file.filename,
        //   folder: req.file.folder, // Added folder info
        // });

        uploadResponse = {
          url: req.file.path,
          secure_url: req.file.secure_url,
          public_id: req.file.filename,
          folder: req.file.folder,
        };

        loggedInUser.photoUrl = uploadResponse.url;
      }

      // Update other profile fields
      const updatableFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
      ];
      updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          loggedInUser[field] = req.body[field];
        }
      });

      // Save the updated user
      await loggedInUser.save();

      // Remove sensitive data before sending response
      const userResponse = loggedInUser.toObject();
      delete userResponse.password;
      delete userResponse.__v;

      res.status(200).send({
        message: `${loggedInUser.firstName}, your profile has been updated`,
        data: userResponse,
        ...(uploadResponse && { upload: uploadResponse }),
      });
    } catch (err) {
      console.error("Profile update error:", err);

      // Handle specific errors
      if (err instanceof multer.MulterError) {
        return res.status(400).send({
          error: "File upload error",
          details: err.message,
        });
      }

      res.status(400).send({
        error: "Profile update failed",
        details: err.message,
      });
    }
  }
);

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    if (!validateProfileForgotPasswordData(req)) {
      throw new Error("Invalid Edit request data");
    }

    const { newPassword, oldPassword } = req.body;

    const loggedInUser = req.user;
    const isValidPassword = await loggedInUser.validatePassword(oldPassword);

    if (!isValidPassword) {
      throw new Error("Old password in incorrect!!");
    }

    // password encrypt
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // console.log("New Hash Password " + hashPassword);
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
