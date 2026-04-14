import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  submitReview,
  getReviews,
  deleteReview,
  toggleHelpful,
  checkEligibility,
  deleteReviewAsOwner,
  replyToReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Specific routes FIRST
router.get("/eligible/:targetType/:targetId", authUser, checkEligibility);
router.post("/submit", authUser, submitReview);
router.delete("/owner/:id", authUser, deleteReviewAsOwner);
router.post("/:id/helpful", authUser, toggleHelpful);
router.post("/:id/reply", authUser, replyToReview);

// Dynamic/generic routes LAST
router.get("/:targetType/:targetId", getReviews);
router.delete("/:id", authUser, deleteReview);

export default router;