const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const validation = require("./validation");

router.post("/topics/:topicId/hacks/:hackId/comments/create",
  validation.validateComments,
  commentController.create);
router.post("/topics/:topicId/hacks/:hackId/comments/:id/destroy",
  commentController.destroy);

module.exports = router;
