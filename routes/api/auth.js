const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const { Schemas } = require("../../users/models/user");
const users = require("../../auth/controllers/users");

const router = express.Router();

router.post("/register", validateBody(Schemas.registerSchema), users.register);

router.post("/login", validateBody(Schemas.registerSchema), users.login);

// router.post("/logout");

module.exports = router;
