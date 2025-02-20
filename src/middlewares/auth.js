const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the coken from the req cookie
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    // validate the  token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    // Find the userName
    const user = await User.findById({ _id });
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
