const ctrlWrapper = require("../decorators/ctrlWrapper");
const auth = require("./auth");

module.exports = {
  register: ctrlWrapper(auth.register),
  login: ctrlWrapper(auth.login),
  getCurrent: ctrlWrapper(auth.getCurrent),
  logout: ctrlWrapper(auth.logout),
  updateAvatar: ctrlWrapper(auth.updateAvatar),
};
