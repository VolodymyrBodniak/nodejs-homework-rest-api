const ctrlWrapper = require("../../decorators/ctrlWrapper");
const auth = require("../services/auth");

module.exports = {
  register: ctrlWrapper(auth.register),
  login: ctrlWrapper(auth.login),
};
