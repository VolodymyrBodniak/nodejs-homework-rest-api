const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../constants/env");
const { User } = require("../../users/models/user");
const HttpError = require("../../helpers/HttpError");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../", "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });

  if (registeredUser) {
    throw HttpError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: passwordHash,
    avatarURL,
  });

  const user = {
    email: newUser.email,
    password: newUser.password,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
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

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const resultUpload = path.join(avatarsDir, originalname);

  const avatar = await Jimp.read(tempUpload);
  await avatar.resize(250, 250).writeAsync(resultUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", originalname);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
};
