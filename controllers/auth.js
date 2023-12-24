const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, BASE_URL } = require("../constants/env");
const { User } = require("../models/user");
const HttpError = require("../helpers/HttpError");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });

  if (registeredUser) {
    throw HttpError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: passwordHash,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  const user = {
    email: newUser.email,
    // password: newUser.password,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  };
  res.status(201).json({ user });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const registeredUser = await User.findOne({ verificationToken });

  if (!registeredUser) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(registeredUser._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({ message: "Verification successful" });
};

const resendVerifiedEmail = async (req, res) => {
  const { email } = req.body;
  const registeredUser = await User.findOne({ email });

  if (!registeredUser) {
    throw HttpError(400, "missing required field email");
  }

  if (registeredUser.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${registeredUser.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });

  if (!registeredUser) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!registeredUser.verify) {
    throw HttpError(401, "Email not verified");
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
    // password: registeredUser.password,
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
  verifyEmail,
  resendVerifiedEmail,
};
