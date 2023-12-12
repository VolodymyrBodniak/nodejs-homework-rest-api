const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../constants/env");
const { User } = require("../../users/models/user");
const HttpError = require("../../helpers/HttpError");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });

  if (registeredUser) {
    throw HttpError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: passwordHash });
  const user = {
    email: newUser.email,
    password: newUser.password,
    subscription: newUser.subscription,
  };
  res.status(201).json({ user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });

  if (!registeredUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(
    password,
    registeredUser.password
  );

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const user = {
    email: registeredUser.email,
    password: registeredUser.password,
    subscription: registeredUser.subscription,
  };

  const payload = {
    id: registeredUser._id,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(registeredUser._id, { token });
  res.json({ token, user });
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
};
