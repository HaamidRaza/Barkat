import CommunityRecipe from "../models/CommuntiyRecipe.js";
import { v2 as cloudinary } from "cloudinary";

// POST /recipe/submit  (authUser)
export const submitRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      linkedProducts,
      videoUrl,
    } = req.body;

    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "community_recipes",
      });
      photoUrl = result.secure_url;
    }

    const recipe = await CommunityRecipe.create({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      prepTime,
      cookTime,
      linkedProducts: req.body.linkedProducts
        ? JSON.parse(req.body.linkedProducts)
        : [],
      videoUrl: req.body.videoUrl || "",
      photo: photoUrl,
      submittedBy: req.user.id,
      status: "pending",
    });

    res.json({ success: true, message: "Recipe submitted for review", recipe });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /recipe/approved  (public)
export const getApprovedRecipes = async (req, res) => {
  try {
    const recipes = await CommunityRecipe.find({ status: "approved" })
      .populate("submittedBy", "name")
      .populate("linkedProducts", "name price offerPrice image");
    res.json({ success: true, recipes });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /recipe/approved/:id  (public)
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findOne({
      _id: req.params.id,
      status: "approved",
    })
      .populate("submittedBy", "name")
      .populate("linkedProducts", "name price offerPrice image");
    if (!recipe)
      return res.json({ success: false, message: "Recipe not found" });
    res.json({ success: true, recipe });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /api/recipe/my  (authUser)
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await CommunityRecipe.find({
      submittedBy: req.user.id,
    }).sort({ createdAt: -1 });
    res.json({ success: true, recipes });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/recipe/:id  (authUser — own recipes only)
export const deleteMyRecipe = async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findOne({
      _id: req.params.id,
      submittedBy: req.user.id,
    });
    if (!recipe)
      return res.json({ success: false, message: "Not found or unauthorized" });
    await recipe.deleteOne();
    res.json({ success: true, message: "Recipe deleted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Admin handlers ──────────────────────────────────────────

// GET /admin/recipes/pending  (authAdmin)
export const getPendingRecipes = async (req, res) => {
  try {
    const recipes = await CommunityRecipe.find({ status: "pending" })
      .populate("submittedBy", "name email")
      .populate("linkedProducts", "name price image");
    res.json({ success: true, recipes });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/admin/recipes/:id/approve  (authAdmin)
export const approveRecipe = async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: "" },
      { new: true },
    );
    if (!recipe)
      return res.json({ success: false, message: "Recipe not found" });
    res.json({ success: true, message: "Recipe approved", recipe });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/admin/recipes/:id/reject  (authAdmin)
export const rejectRecipe = async (req, res) => {
  try {
    const { reason } = req.body;
    const recipe = await CommunityRecipe.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason || "Did not meet guidelines",
      },
      { new: true },
    );
    if (!recipe)
      return res.json({ success: false, message: "Recipe not found" });
    res.json({ success: true, message: "Recipe rejected", recipe });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/recipes/:id  (authAdmin)
export const adminDeleteRecipe = async (req, res) => {
  try {
    await CommunityRecipe.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Recipe deleted by admin" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
