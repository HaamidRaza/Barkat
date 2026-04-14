import Review from "../models/Review.js";
import Order from "../models/Order.js";
import CommunityRecipe from "../models/CommuntiyRecipe.js";

// ── Eligibility checks ──────────────────────────────────────

const hasDeliveredOrder = async (userId) => {
  const order = await Order.findOne({
    userId,
    status: "Delivered",
  });
  return !!order;
};

const hasPurchasedProduct = async (userId, productId) => {
  const order = await Order.findOne({
    userId,
    status: "Delivered",
    "items.product": productId,
  });
  return !!order;
};

// ── Submit review ───────────────────────────────────────────

// POST /review/submit  (authUser)
export const submitReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment, vote } = req.body;
    const userId = req.user.id;

    // Eligibility
    if (targetType === "product") {
      const eligible = await hasPurchasedProduct(userId, targetId);
      if (!eligible)
        return res.json({
          success: false,
          message:
            "You can only review products you have purchased and received.",
        });
      if (!rating || rating < 1 || rating > 5)
        return res.json({
          success: false,
          message: "Rating must be between 1 and 5.",
        });
    }

    if (targetType === "communityRecipe") {
      const eligible = await hasDeliveredOrder(userId);
      if (!eligible)
        return res.json({
          success: false,
          message: "You need at least one delivered order to review recipes.",
        });
      if (!vote || !["up", "down"].includes(vote))
        return res.json({
          success: false,
          message: "Vote must be 'up' or 'down'.",
        });
    }

    // Upsert — allow editing existing review
    const updateData = {
      comment: comment || "",
    };

    if (targetType === "product") updateData.rating = rating;
    if (targetType === "communityRecipe") updateData.vote = vote;

    const review = await Review.findOneAndUpdate(
      { targetType, targetId, user: userId },
      updateData,
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    ).populate("user", "name");
    
    res.json({ success: true, message: "Review submitted", review });
  } catch (err) {
    if (err.code === 11000)
      return res.json({
        success: false,
        message: "You have already reviewed this.",
      });
    res.json({ success: false, message: err.message });
  }
};

// ── Get reviews ─────────────────────────────────────────────

// GET /review/:targetType/:targetId  (public)
export const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const reviews = await Review.find({ targetType, targetId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    
    // Summary stats
    let summary = {};
    if (targetType === "product") {
      const ratings = reviews.filter((r) => r.rating).map((r) => r.rating);
      summary = {
        average: ratings.length
          ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
          : 0,
        total: ratings.length,
        breakdown: [5, 4, 3, 2, 1].map((star) => ({
          star,
          count: ratings.filter((r) => r === star).length,
        })),
      };
    }

    if (targetType === "communityRecipe") {
      summary = {
        upvotes: reviews.filter((r) => r.vote === "up").length,
        downvotes: reviews.filter((r) => r.vote === "down").length,
        total: reviews.length,
      };
    }

    res.json({ success: true, reviews, summary });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Delete review ───────────────────────────────────────────

// DELETE /review/:id  (authUser — own review only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!review)
      return res.json({
        success: false,
        message: "Not found or unauthorized.",
      });
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Helpful vote ────────────────────────────────────────────

// POST /review/:id/helpful  (authUser)
export const toggleHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res.json({ success: false, message: "Review not found." });

    const userId = req.user.id;
    const already = review.helpfulVotes.some((v) => v.toString() === userId);

    if (already) {
      review.helpfulVotes = review.helpfulVotes.filter(
        (v) => v.toString() !== userId,
      );
    } else {
      review.helpfulVotes.push(userId);
    }

    await review.save();
    res.json({
      success: true,
      helpfulCount: review.helpfulVotes.length,
      marked: !already,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Check eligibility ───────────────────────────────────────

// GET /review/eligible/:targetType/:targetId  (authUser)
export const checkEligibility = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user.id;

    let eligible = false;
    if (targetType === "product") {
      eligible = await hasPurchasedProduct(userId, targetId);
    } else if (targetType === "communityRecipe") {
      eligible = await hasDeliveredOrder(userId);
    }

    // Check if already reviewed
    const existing = await Review.findOne({
      targetType,
      targetId,
      user: userId,
    });

    res.json({ success: true, eligible, existing: existing || null });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
// POST /api/review/:id/reply  (authUser — recipe owner only)
export const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review)
      return res.json({ success: false, message: "Review not found" });

    // Only allow reply on communityRecipe reviews
    if (review.targetType !== "communityRecipe")
      return res.json({
        success: false,
        message: "Replies only allowed on recipe reviews",
      });

    review.reply = {
      text: reply,
      repliedAt: new Date(),
    };
    await review.save();
    res.json({ success: true, message: "Reply added", review });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/review/admin/:id  (authUser — recipe owner)
export const deleteReviewAsOwner = async (req, res) => {
  try {
    const { recipeId } = req.body;
    // verify the requester owns the recipe
    const recipe = await CommunityRecipe.findOne({
      _id: recipeId,
      submittedBy: req.user.id,
    });
    if (!recipe) return res.json({ success: false, message: "Not authorized" });

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
