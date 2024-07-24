const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.getProfile);

router.put("/:id", userController.updateProfile);

router.delete("/:id", userController.deleteAccount);

module.exports = router;
