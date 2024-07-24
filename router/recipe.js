const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");
const authMiddleware = require("../middleware/authMiddleware");
const recipeOwnership = require("../middleware/recipeOwnership");

router.post("/", authMiddleware, recipeController.createRecipe);

router.get("/", recipeController.getAllRecipes);

router.get("/:id", recipeController.getRecipeById);

router.put(
  "/:id",
  authMiddleware,
  recipeOwnership,
  recipeController.updateRecipe
);

router.delete(
  "/:id",
  authMiddleware,
  recipeOwnership,
  recipeController.deleteRecipe
);

module.exports = router;
