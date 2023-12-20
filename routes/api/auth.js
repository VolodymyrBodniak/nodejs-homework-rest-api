const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const { Schemas } = require("../../users/models/user");
const users = require("../../controllers/users");
const authanticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(Schemas.registerSchema), users.register);

router.get("/verify/:verificationToken", users.verifyEmail);

router.post(
  "/verify",
  validateBody(Schemas.emailSchema),
  users.resendVerifiedEmail
);

router.post("/login", validateBody(Schemas.loginSchema), users.login);

router.get("/current", authanticate, users.getCurrent);

router.post("/logout", authanticate, users.logout);

router.patch(
  "/avatars",
  authanticate,
  upload.single("avatar"),
  users.updateAvatar
);

module.exports = router;
