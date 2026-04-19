import { useState, useEffect } from "react";
import axios from "../config/api.js";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import { ThumbsUp, ThumbsDown, Pencil, Trash2 } from "lucide-react";

const ReviewForm = ({ targetType, targetId, onSubmitted }) => {
  const [eligible, setEligible] = useState(null);
  const [existing, setExisting] = useState(null);
  const [rating, setRating] = useState(0);
  const [vote, setVote] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`/review/eligible/${targetType}/${targetId}`)
      .then(({ data }) => {
        if (data.success) {
          setEligible(data.eligible);
          if (data.existing) {
            setExisting(data.existing);
            setRating(data.existing.rating || 0);
            setVote(data.existing.vote || null);
            setComment(data.existing.comment || "");
          }
        }
      })
      .finally(() => setChecking(false));
  }, [targetType, targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (targetType === "product" && !rating)
      return toast.error("Please select a star rating");
    if (targetType === "communityRecipe" && !vote)
      return toast.error("Please select upvote or downvote");

    setLoading(true);
    try {
      await toast.promise(
        axios.post("/review/submit", {
          targetType,
          targetId,
          rating,
          vote,
          comment,
        }),
        {
          loading: "Submitting review...",
          success: (response) => {
            const { data } = response;
            if (data.success) {
              setExisting(data.review);
              setEditing(false);
              setTimeout(() => onSubmitted?.(), 0);
              return existing ? "Review updated!" : "Review submitted!";
            } else {
              throw new Error(data.message || "Failed to submit review");
            }
          },
          error: (err) => {
            return err.response?.data?.message || err.message || "Something went wrong";
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await toast.promise(
        axios.delete(`/review/${existing._id}`),
        {
          loading: "Deleting review...",
          success: (response) => {
            const { data } = response;
            if (data.success) {
              setRating(0);
              setVote(null);
              setComment("");
              setExisting(null);
              setEditing(false);
              setTimeout(() => onSubmitted?.(), 0);
              return "Review deleted";
            } else {
              throw new Error(data.message || "Failed to delete review");
            }
          },
          error: (err) => {
            return err.response?.data?.message || err.message || "Failed to delete";
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCancel = () => {
    // Reset fields back to existing values
    setRating(existing?.rating || 0);
    setVote(existing?.vote || null);
    setComment(existing?.comment || "");
    setEditing(false);
  };

  if (checking)
    return (
      <p className="text-sm py-2" style={{ color: "#9A8060" }}>
        Checking eligibility...
      </p>
    );

  if (!eligible)
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: "#FFF8E6",
          color: "#92650A",
          border: "1px solid #F0D080",
        }}
      >
        {targetType === "product"
          ? "Only customers who have received this product can leave a review."
          : "You need at least one delivered order to review recipes."}
      </div>
    );

  // ── Submitted state — show compact review card ──
  if (existing && !editing) {
    return (
      <div
        className="rounded-2xl p-4 space-y-2"
        style={{ background: "#FEFAF2", border: "1.5px solid #C4A882" }}
      >
        <div className="flex items-center justify-between">
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#8B3A2A" }}
          >
            Your review
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center cursor-pointer gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
              style={{ background: "#EDE4CE", color: "#6B5140" }}
            >
              <Pencil size={11} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center cursor-pointer gap-1 text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ background: "#FDEEEE", color: "#922020" }}
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        </div>

        {/* Rating or vote */}
        {targetType === "product" && existing.rating && (
          <StarRating value={existing.rating} readonly size={16} />
        )}
        {targetType === "communityRecipe" && existing.vote && (
          <span
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
            style={
              existing.vote === "up"
                ? { background: "#EDFAF3", color: "#1A6B40" }
                : { background: "#FDEEEE", color: "#922020" }
            }
          >
            {existing.vote === "up" ? (
              <ThumbsUp size={11} />
            ) : (
              <ThumbsDown size={11} />
            )}
            {existing.vote === "up" ? "Upvoted" : "Downvoted"}
          </span>
        )}

        {/* Comment */}
        {existing.comment ? (
          <p className="text-sm" style={{ color: "#6B5140" }}>
            {existing.comment}
          </p>
        ) : (
          <p className="text-xs italic" style={{ color: "#B8A48A" }}>
            No comment added
          </p>
        )}
      </div>
    );
  }

  // ── Form — new or editing ──
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
    >
      <h3 className="font-semibold text-sm" style={{ color: "#1E1008" }}>
        {existing ? "Edit your review" : "Write a review"}
      </h3>

      {targetType === "product" && (
        <div>
          <p className="text-xs mb-1.5" style={{ color: "#9A8060" }}>
            Your rating
          </p>
          <StarRating value={rating} onChange={setRating} size={24} />
        </div>
      )}

      {targetType === "communityRecipe" && (
        <div>
          <p className="text-xs mb-2" style={{ color: "#9A8060" }}>
            Your vote
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setVote("up")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                vote === "up"
                  ? {
                      background: "#EDFAF3",
                      color: "#1A6B40",
                      border: "1.5px solid #27AE60",
                    }
                  : {
                      background: "#F5F0E8",
                      color: "#9A8060",
                      border: "1.5px solid #E0D2B4",
                    }
              }
            >
              <ThumbsUp size={15} /> Upvote
            </button>
            <button
              type="button"
              onClick={() => setVote("down")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                vote === "down"
                  ? {
                      background: "#FDEEEE",
                      color: "#922020",
                      border: "1.5px solid #E53935",
                    }
                  : {
                      background: "#F5F0E8",
                      color: "#9A8060",
                      border: "1.5px solid #E0D2B4",
                    }
              }
            >
              <ThumbsDown size={15} /> Downvote
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs mb-1.5" style={{ color: "#9A8060" }}>
          Comment <span style={{ color: "#B8A48A" }}>(optional)</span>
        </p>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            targetType === "product"
              ? "What did you think of this product?"
              : "Share your experience with this recipe..."
          }
          className="w-full text-sm outline-none resize-none rounded-xl px-4 py-2.5"
          style={{
            background: "#FAF5EC",
            border: "1px solid #E0D2B4",
            color: "#1E1008",
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-xl cursor-pointer text-sm font-semibold disabled:opacity-60"
          style={{ background: "#8B3A2A", color: "#FFECD0" }}
        >
          {loading ? "Saving..." : existing ? "Update" : "Submit review"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={handleEditCancel}
            className="px-5 py-2 rounded-xl cursor-pointer text-sm font-medium"
            style={{ background: "#EDE4CE", color: "#6B5140" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
