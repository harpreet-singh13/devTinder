const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_GMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App-specific password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: "support@devlink.click", // Sender address
      to, // Recipient address
      subject, // Email subject
      html, // Email body (HTML)
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;

/*
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "email-smtp.eu-north-1.amazonaws.com", // SES SMTP server
  port: 465, // SSL port
  secure: true, // Use SSL
  auth: {
    user: "AKIARSYRSGSGHYQPODHU", // SES SMTP username
    pass: "BKfYSrZz7e4u5JVRP2rZftnVqhPEg21ei2CI2BHT6sQ+", // SES SMTP password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: "support@devlink.click", // Use your custom domain email here
      to, // Recipient address
      subject, // Email subject
      html, // Email body (HTML)
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;

*/
