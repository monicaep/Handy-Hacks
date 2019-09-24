const express = require("express");
const router = express.Router();
const hackController = require("../controllers/hackController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/topics/:topicId/hacks/new", hackController.new);
router.get("/topics/:topicId/hacks/:id", hackController.show);
router.get("/topics/:topicId/hacks/:id/edit", hackController.edit);

router.post("/topics/:topicId/hacks/create", helper.ensureAuthenticated, validation.validateHacks, hackController.create);
router.post("/topics/:topicId/hacks/:id/update", validation.validateHacks, hackController.update);
router.post("/topics/:topicId/hacks/:id/destroy", hackController.destroy);

module.exports = router;
