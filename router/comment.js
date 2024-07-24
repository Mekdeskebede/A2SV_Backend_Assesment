const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/:recipeId/comments",
  authMiddleware,
  commentController.createComment
);

router.get("/:recipeId/comments", commentController.getCommentsByRecipeId);

router.put("/comments/:id", authMiddleware, commentController.updateComment);

router.delete("/comments/:id", authMiddleware, commentController.deleteComment);

module.exports = router;
