const express = require("express");
const router = express.Router();
const hackController = require("../controllers/hackController");

router.get("/topics/:topicId/hacks/new", hackController.new);
router.get("/topics/:topicId/hacks/:id", hackController.show);
router.get("/topics/:topicId/hacks/:id/edit", hackController.edit);

router.post("/topics/:topicId/hacks/create", hackController.create);
router.post("/topics/:topicId/hacks/:id/destroy", hackController.destroy);
router.post("/topics/:topicId/hacks/:id/update", hackController.update);

module.exports = router;
