const sgEmail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = require("../constants/env");
require("dotenv").config();

sgEmail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "bodnjak@gmail.com" };
  await sgEmail.send(email);
  return true;
};

module.exports = sendEmail;
