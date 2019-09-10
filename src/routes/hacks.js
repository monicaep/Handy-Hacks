const express = require("express");
const router = express.Router();
const hackController = require("../controllers/hackController");
const validation = require("./validation");

router.get("/topics/:topicId/hacks/new", hackController.new);
router.get("/topics/:topicId/hacks/:id", hackController.show);
router.get("/topics/:topicId/hacks/:id/edit", hackController.edit);

router.post("/topics/:topicId/hacks/create", validation.validatePosts, hackController.create);
router.post("/topics/:topicId/hacks/:id/destroy", hackController.destroy);
router.post("/topics/:topicId/hacks/:id/update", validation.validatePosts, hackController.update);

module.exports = router;
