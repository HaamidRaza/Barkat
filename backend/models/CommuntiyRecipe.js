import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
  },
  { _id: false },
);

const stepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true },
  },
  { _id: false },
);

const communityRecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    photo: { type: String }, // Cloudinary URL
    prepTime: { type: Number, required: true }, // minutes
    cookTime: { type: Number, required: true }, // minutes
    linkedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    videoUrl: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          if (!v) return true; // optional field
          // Only allow YouTube URLs
          return /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(
            v,
          );
        },
        message: "Only valid YouTube video URLs are allowed.",
      },
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true },
);

const CommunityRecipe = mongoose.model(
  "CommunityRecipe",
  communityRecipeSchema,
);
export default CommunityRecipe;
