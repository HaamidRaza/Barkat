import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["product", "communityRecipe"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType", // dynamic ref based on targetType
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // Product reviews only
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Both
    comment: {
      type: String,
      trim: true,
      default: "",
    },

    // Recipe reviews only — upvote/downvote
    vote: {
      type: String,
      enum: ["up", "down", null],
      default: null,
    },

    // Helpful votes — array of userIds who found this review helpful
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    reply: {
      text: { type: String, default: "" },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true },
);

// One review per user per target
reviewSchema.index({ targetType: 1, targetId: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
