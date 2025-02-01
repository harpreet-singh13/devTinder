const validator = require("validator");

const validateSignUpData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;

	if (!firstName || !lastName) {
		throw new Error("Name is not valid");
	} else if (!validator.isEmail(emailId)) {
		throw new Error("EmailId is not valid!");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Please use strong password!");
	}
};

const validateEditProfileData = (req) => {
	const allowedEditFields = [
		"firstName",
		"lastName",
		"emailId",
		"age",
		"gender",
		"about",
		"skills",
		"photoUrl",
	];

	const isEditAllowed = Object.keys(req.body).every((field) =>
		allowedEditFields.includes(field)
	);

	return isEditAllowed;
};

const validateProfileForgotPasswordData = (req) => {
	const allowedEditFields = ["newPassword", "oldPassword"];

	const isEditAllowed = Object.keys(req.body).every((field) =>
		allowedEditFields.includes(field)
	);

	return isEditAllowed;
};

module.exports = {
	validateSignUpData,
	validateEditProfileData,
	validateProfileForgotPasswordData,
};
