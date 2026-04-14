import express from "express";
import multer from "multer";
import authUser from "../middlewares/authUser.js";
import {
  submitRecipe,
  getApprovedRecipes,
  getRecipeById,
  getMyRecipes,
  deleteMyRecipe,
} from "../controllers/recipeController.js";

const recipeRouter = express.Router();
const upload = multer({ dest: "uploads/" });

recipeRouter.get("/approved", getApprovedRecipes); // public
recipeRouter.get("/approved/:id", getRecipeById); // public
recipeRouter.post("/submit", authUser, upload.single("photo"), submitRecipe);
recipeRouter.get("/my", authUser, getMyRecipes);
recipeRouter.delete("/:id", authUser, deleteMyRecipe);

export default recipeRouter;
