import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/api.js";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext.jsx";
import {
  HandPlatter,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import ReviewList from "../../components/ReviewList";

const statusStyle = {
  pending: { bg: "#FFF8E6", color: "#92650A", dot: "#F0A500" },
  approved: { bg: "#EDFAF3", color: "#1A6B40", dot: "#27AE60" },
  rejected: { bg: "#FDEEEE", color: "#922020", dot: "#E53935" },
};

const MyRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [openReviews, setOpenReviews] = useState({});
  const { getReviewSummary, fetchAllRecipeSummaries } = useAppContext();

  const fetchMyRecipes = async () => {
    try {
      const { data } = await axios.get("/recipe/my", { withCredentials: true });
      if (data.success) {
        setRecipes(data.recipes);
        fetchAllRecipeSummaries(data.recipes.map((r) => r._id));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    const { data } = await axios.delete(`/recipe/${id}`, {
      withCredentials: true,
    });
    if (data.success) {
      toast.success("Recipe deleted");
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } else {
      toast.error(data.message);
    }
  };

  const toggleReviews = (id) =>
    setOpenReviews((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#8B3A2A", borderTopColor: "transparent" }}
        />
      </div>
    );

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-10 min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
        >
          My Recipes
        </h1>
        <button
          onClick={() => navigate("/submit-recipe")}
          className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
          style={{ background: "#8B3A2A", color: "#FFECD0" }}
        >
          + New Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center py-20 pt-50 gap-3 text-center">
          <HandPlatter size={32} style={{ color: "#C8B89A" }} />
          <p className="font-semibold" style={{ color: "#6B5140" }}>
            No recipes yet
          </p>
          <p className="text-sm" style={{ color: "#9A8060" }}>
            Share your first recipe with the community!
          </p>
          <button
            onClick={() => navigate("/submit-recipe")}
            className="mt-2 px-5 py-2 cursor-pointer rounded-xl text-sm font-semibold"
            style={{ background: "#8B3A2A", color: "#FFECD0" }}
          >
            Submit a recipe
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((r) => {
            const summary = getReviewSummary("communityRecipe", r._id);
            const s = statusStyle[r.status];
            const reviewsOpen = openReviews[r._id];

            return (
              <div
                key={r._id}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
              >
                {/* ── Recipe row ── */}
                <div className="p-4 flex gap-4 items-start">
                  {/* Photo */}
                  {r.photo ? (
                    <img
                      src={r.photo}
                      alt={r.title}
                      className="w-20 h-20 object-cover rounded-xl shrink-0"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: "#EDE4CE" }}
                    >
                      <HandPlatter size={22} style={{ color: "#B8A48A" }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2
                        onClick={() =>
                          r.status === "approved" &&
                          navigate(`/community-recipes/${r._id}`)
                        }
                        className={`font-semibold text-sm truncate ${r.status === "approved" ? "cursor-pointer hover:underline" : ""}`}
                        style={{ color: "#1E1008" }}
                      >
                        {r.title}
                      </h2>
                      {/* Status badge */}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: s.dot }}
                        />
                        {r.status}
                      </span>
                    </div>

                    <p
                      className="text-xs line-clamp-2 mb-2"
                      style={{ color: "#9A8060" }}
                    >
                      {r.description}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div
                        className="flex items-center gap-1 text-xs"
                        style={{ color: "#B8A48A" }}
                      >
                        <Clock size={10} /> {r.prepTime + r.cookTime} min
                      </div>

                      {/* Vote summary */}
                      {summary?.total > 0 && (
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#27AE60" }}
                        >
                          ↑{summary.upvotes} ↓{summary.downvotes}
                        </span>
                      )}

                      {r.status === "rejected" && r.rejectionReason && (
                        <p className="text-xs" style={{ color: "#E53935" }}>
                          Reason: {r.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg cursor-pointer"
                      style={{ color: "#E53935", background: "#FDEEEE" }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>

                    {/* Show reviews toggle — only for approved */}
                    {r.status === "approved" && (
                      <button
                        onClick={() => toggleReviews(r._id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg cursor-pointer"
                        style={{ background: "#EDE4CE", color: "#6B5140" }}
                      >
                        {reviewsOpen ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                        {summary?.total > 0
                          ? `${summary.total} review${summary.total !== 1 ? "s" : ""}`
                          : "Reviews"}
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Expandable reviews panel ── */}
                {reviewsOpen && r.status === "approved" && (
                  <div
                    className="border-t px-4 py-5 space-y-4"
                    style={{ borderColor: "#E0D2B4", background: "#FAF5EC" }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#8B3A2A" }}
                    >
                      Community feedback
                    </p>
                    <ReviewList
                      targetType="communityRecipe"
                      targetId={r._id}
                      refreshTrigger={reviewRefresh}
                      isOwner={true}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
