const express = require("express");
const contacts = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const { Schemas } = require("../../models/contact");
const isValidId = require("../../middlewares/isValidId");
const validateFavorite = require("../../middlewares/validateFavorite");
const authanticate = require("../../middlewares/authenticate");

const router = express.Router();

router.get("/", authanticate, contacts.listContacts);

router.get("/:contactId", authanticate, isValidId, contacts.getContactById);

router.post(
  "/",
  authanticate,
  validateBody(Schemas.bodySchema),
  contacts.addContact
);

router.delete("/:contactId", authanticate, isValidId, contacts.removeContact);

router.put(
  "/:contactId",
  authanticate,
  isValidId,
  validateBody(Schemas.bodySchema),
  contacts.updateContact
);

router.patch(
  "/:contactId/favorite",
  authanticate,
  isValidId,
  validateFavorite(Schemas.favoriteSchema),
  contacts.updateStatusContact
);

module.exports = router;
