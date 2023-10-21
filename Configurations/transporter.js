const nodemailer = require('nodemailer');

// Create a transporter object using your SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'outlook', 'yahoo', etc.
  auth: {
    user: "ahmedraihanalif@gmail.com", // Your email address
    pass: "xrkv mokm rbrz zqpb", // Your email password
  },
});

module.exports = transporter;
