import express from "express";
import {
  adminLogout,
  approveSeller,
  getAllCommunityRecipes,
  getAllProducts,
  getAllUsers,
  getPendingSellers,
  isAdminAuth,
  rejectSeller,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  adminDeleteRecipe,
  approveRecipe,
  getPendingRecipes,
  rejectRecipe,
} from "../controllers/recipeController.js";

const adminRouter = express.Router();

// Protected routes — auth required
adminRouter.get("/is-auth", authAdmin, isAdminAuth);
adminRouter.get("/logout", authAdmin, adminLogout);
adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.get("/products", authAdmin, getAllProducts);
adminRouter.get("/recipes/all", authAdmin, getAllCommunityRecipes);

adminRouter.get("/sellers/pending", authAdmin, getPendingSellers);
adminRouter.patch("/sellers/:userId/approve", authAdmin, approveSeller);
adminRouter.patch("/sellers/:userId/reject", authAdmin, rejectSeller);

adminRouter.get("/recipes/pending", authAdmin, getPendingRecipes);
adminRouter.post("/recipes/:id/approve", authAdmin, approveRecipe);
adminRouter.post("/recipes/:id/reject", authAdmin, rejectRecipe);
adminRouter.delete("/recipes/:id", authAdmin, adminDeleteRecipe);
export default adminRouter;
