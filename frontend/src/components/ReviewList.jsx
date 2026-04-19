import { useState, useEffect, useCallback } from "react";
import axios from "../config/api.js";
import { ThumbsUp, ThumbsDown, Trash2, CornerDownRight, X } from "lucide-react";
import StarRating from "./StarRating";
import toast from "react-hot-toast";

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ReviewList = ({
  targetType,
  targetId,
  refreshTrigger,
  isOwner = false,
}) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [replyOpen, setReplyOpen] = useState({});

  useEffect(() => {
    try {
      setLoading(true);
      axios
        .get(`/review/${targetType}/${targetId}`)
        .then(({ data }) => {
          if (data.success) {
            setReviews(data.reviews);
            setSummary(data.summary);
          }
        })
        .finally(() => setLoading(false));
    } catch (e) {
      console.error(e.message);
    }
  }, [targetType, targetId, refreshTrigger]);

  const handleHelpful = async (id) => {
    const { data } = await axios.post(`/review/${id}/helpful`);
    if (data.success) {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, helpfulVotes: { length: data.helpfulCount } }
            : r,
        ),
      );
    }
  };
  
  const handleOwnerDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    const { data } = await axios.delete(`/review/owner/${reviewId}`, {
      data: { productId: targetId }, // was: recipeId
    });
    if (data.success) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review removed");
    }
  };

  const handleReply = async (reviewId) => {
    const text = replyText[reviewId]?.trim();
    if (!text) return;
    const { data } = await axios.post(`/review/${reviewId}/reply`, {
      reply: text,
    });
    if (data.success) {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? { ...r, reply: data.review.reply } : r,
        ),
      );
      setReplyOpen((prev) => ({ ...prev, [reviewId]: false }));
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    }
  };

  const handleDeleteReply = async (reviewId) => {
    const { data } = await axios.post(`/review/${reviewId}/reply`, {
      reply: "",
    });
    if (data.success) {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, reply: { text: "", repliedAt: null } }
            : r,
        ),
      );
    }
  };

  if (loading)
    return (
      <p className="text-sm py-4" style={{ color: "#9A8060" }}>
        Loading reviews...
      </p>
    );

  return (
    <div className="space-y-6">
      {/* ── Summary ── */}
      {summary && reviews.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
        >
          {targetType === "product" && (
            <div className="flex gap-6 items-center">
              <div className="text-center">
                <p className="text-4xl font-bold" style={{ color: "#1E1008" }}>
                  {summary.average}
                </p>
                <StarRating
                  value={Math.round(summary.average)}
                  readonly
                  size={16}
                />
                <p className="text-xs mt-1" style={{ color: "#9A8060" }}>
                  {summary.total} review{summary.total !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex-1 space-y-1.5">
                {summary.breakdown.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span
                      className="text-xs w-4 text-right"
                      style={{ color: "#9A8060" }}
                    >
                      {star}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="#E8A020"
                      stroke="#E8A020"
                      strokeWidth="1.5"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: "#EDE4CE" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: "#E8A020",
                          width: summary.total
                            ? `${(count / summary.total) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs w-4" style={{ color: "#9A8060" }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {targetType === "communityRecipe" && (
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <ThumbsUp size={18} style={{ color: "#27AE60" }} />
                <span className="font-semibold" style={{ color: "#1E1008" }}>
                  {summary.upvotes}
                </span>
                <span
                  className="text-sm hidden md:block"
                  style={{ color: "#9A8060" }}
                >
                  upvotes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown size={18} style={{ color: "#E53935" }} />
                <span className="font-semibold" style={{ color: "#1E1008" }}>
                  {summary.downvotes}
                </span>
                <span
                  className="text-sm hidden md:block"
                  style={{ color: "#9A8060" }}
                >
                  downvotes
                </span>
              </div>
              <span className="text-sm ml-auto" style={{ color: "#9A8060" }}>
                {summary.total} review{summary.total !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Review cards ── */}
      {reviews.length === 0 ? (
        <p className="text-sm py-4" style={{ color: "#9A8060" }}>
          No reviews yet. Be the first!
        </p>
      ) : (
        reviews.map((r) => (
          <div
            key={r._id}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "#EDE4CE", color: "#6B5140" }}
                >
                  {r.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#1E1008" }}
                >
                  {r.user?.name || "Anonymous"}
                </span>
                <span className="text-xs" style={{ color: "#B8A48A" }}>
                  {timeAgo(r.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {targetType === "product" && r.rating && (
                  <StarRating value={r.rating} readonly size={14} />
                )}
                {targetType === "communityRecipe" && r.vote && (
                  <span
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={
                      r.vote === "up"
                        ? { background: "#EDFAF3", color: "#1A6B40" }
                        : { background: "#FDEEEE", color: "#922020" }
                    }
                  >
                    {r.vote === "up" ? (
                      <ThumbsUp size={11} />
                    ) : (
                      <ThumbsDown size={11} />
                    )}
                    {r.vote === "up" ? "Upvoted" : "Downvoted"}
                  </span>
                )}

                {/* Owner delete button */}
                {isOwner && (
                  <button
                    onClick={() => handleOwnerDelete(r._id)}
                    className="p-1 cursor-pointer rounded-lg transition-colors"
                    style={{ color: "#E53935" }}
                    title="Remove this review"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Comment */}
            {r.comment && (
              <p className="text-sm" style={{ color: "#6B5140" }}>
                {r.comment}
              </p>
            )}

            {/* Existing reply */}
            {r.reply?.text && (
              <div
                className="flex gap-2 pl-3 border-l-2"
                style={{ borderColor: "#C4A882" }}
              >
                <CornerDownRight
                  size={13}
                  style={{ color: "#8B3A2A", marginTop: 2, flexShrink: 0 }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: "#8B3A2A" }}
                    >
                      Recipe owner
                    </p>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteReply(r._id)}
                        className="text-xs"
                        style={{ color: "#B8A48A" }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "#6B5140" }}>
                    {r.reply.text}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#B8A48A" }}>
                    {timeAgo(r.reply.repliedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Reply input — owner only, recipe type only, no existing reply */}
            {isOwner && targetType === "communityRecipe" && !r.reply?.text && (
              <>
                {replyOpen[r._id] ? (
                  <div
                    className="flex gap-2 pl-3 border-l-2"
                    style={{ borderColor: "#E0D2B4" }}
                  >
                    <CornerDownRight
                      size={13}
                      style={{ color: "#C4A882", marginTop: 8, flexShrink: 0 }}
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        value={replyText[r._id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [r._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a reply..."
                        className="flex-1 text-sm outline-none rounded-lg px-3 py-1.5"
                        style={{
                          background: "#FAF5EC",
                          border: "1px solid #E0D2B4",
                          color: "#1E1008",
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleReply(r._id)
                        }
                      />
                      <button
                        onClick={() => handleReply(r._id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium"
                        style={{ background: "#8B3A2A", color: "#FFECD0" }}
                      >
                        Reply
                      </button>
                      <button
                        onClick={() =>
                          setReplyOpen((prev) => ({ ...prev, [r._id]: false }))
                        }
                        className="text-xs px-2 py-1.5 rounded-lg"
                        style={{ background: "#EDE4CE", color: "#6B5140" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setReplyOpen((prev) => ({ ...prev, [r._id]: true }))
                    }
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#9A8060" }}
                  >
                    <CornerDownRight size={12} /> Reply
                  </button>
                )}
              </>
            )}

            {/* Helpful */}
            <button
              onClick={() => handleHelpful(r._id)}
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: "#9A8060" }}
            >
              <ThumbsUp size={12} fill="currentColor" />
              Helpful ({r.helpfulVotes?.length || 0})
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
