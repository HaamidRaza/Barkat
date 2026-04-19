import { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../config/api.js";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext.jsx";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";
import {
  ArrowLeft,
  ShoppingBasket,
  Clock,
  ChefHat,
  Check,
  Loader2,
} from "lucide-react";

const CommunityRecipeDetail = () => {
  const { id } = useParams();
  const {
    user,
    addToCart,
    navigate,
    getReviewSummary,
    fetchReviewSummary,
    invalidateReviewSummary,
  } = useContext(AppContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/recipe/approved/${id}`);
        if (data.success) {
          setRecipe(data.recipe);
          setThumbnail(data.recipe.photo || null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    setCheckedSteps([]);
  }, [id]);

  useEffect(() => {
    if (recipe?._id) fetchReviewSummary("communityRecipe", recipe._id);
  }, [recipe]);

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/,
    );
    return match ? match[1] : null;
  };
  const toggleStep = (i) =>
    setCheckedSteps((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i],
    );

  const completionPct = recipe?.steps?.length
    ? Math.round((checkedSteps.length / recipe.steps.length) * 100)
    : 0;

  const handleAddAll = () => {
    if (!recipe?.length) {
      toast.error("No linked products for this recipe");
      return;
    }
    recipe.linkedProducts.forEach((p) => addToCart(p._id));
    toast.success(
      `${recipe.linkedProducts.length} product${recipe.linkedProducts.length !== 1 ? "s" : ""} added to basket!`,
    );
  };

  if (loading)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "#FAF5EC" }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "#8B3A2A" }}
        />
      </div>
    );

  if (!recipe)
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        style={{ background: "#FAF5EC" }}
      >
        <ChefHat size={32} style={{ color: "#C8B89A" }} />
        <p className="font-semibold" style={{ color: "#6B5140" }}>
          Recipe not found
        </p>
        <Link
          to="/recipes"
          className="text-sm font-semibold"
          style={{ color: "#8B3A2A" }}
        >
          Back to recipes
        </Link>
      </div>
    );

  const summary = getReviewSummary("communityRecipe", recipe?._id);
  const totalTime = recipe.prepTime + recipe.cookTime;
  const isOwner =
    user?._id === recipe?.submittedBy?._id ||
    user?.id === recipe?.submittedBy?._id;
  return (
    <div
      className="min-h-screen pb-12"
      style={{ background: "#FAF5EC", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .step-row { transition: all 0.2s ease; }
        .back-btn:hover .back-arrow { transform: translateX(-3px); }
        .back-arrow { transition: transform 0.2s ease; }
      `}</style>

      {/* ── Hero — constrained, not full bleed ── */}
      <div className="px-4 md:px-8 lg:px-14 xl:px-20 pt-6 max-w-4xl mx-auto">
        {/* Back + Reviews buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="back-btn inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "#FEFAF2",
              border: "1px solid #E0D2B4",
              color: "#1E1008",
            }}
          >
            <ArrowLeft size={14} className="back-arrow" />
            <span>Back</span>
          </button>
          <button
            onClick={() =>
              reviewsRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "#FEFAF2",
              border: "1px solid #E0D2B4",
              color: "#8B3A2A",
            }}
          >
            ★{" "}
            {summary?.total > 0
              ? `${summary.upvotes} ↑ ${summary.downvotes} ↓`
              : "Reviews"}
          </button>
        </div>

        {/* Image — natural size, centered, rounded */}
        {recipe.photo && (
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ border: "1px solid #E0D2B4", maxHeight: "420px" }}
          >
            <img
              src={recipe.photo}
              alt={recipe.title}
              className="w-full object-cover"
              style={{
                maxHeight: "420px",
                objectPosition: "center",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>
        )}
        {/* Community badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "#8B3A2A18", color: "#8B3A2A" }}
        >
          <ChefHat size={11} /> Community Recipe
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
        >
          {recipe.title}
        </h1>

        {/* Meta strip */}
        <div
          className="flex items-center gap-4 mb-4 flex-wrap text-sm"
          style={{ color: "#6B5140" }}
        >
          <div className="flex items-center gap-1.5">
            <ChefHat size={13} style={{ color: "#8B3A2A" }} />
            {recipe.submittedBy?.name || "Anonymous"}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} style={{ color: "#8B3A2A" }} />
            Prep {recipe.prepTime} min
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} style={{ color: "#8B3A2A" }} />
            Cook {recipe.cookTime} min
          </div>
          <span className="font-semibold" style={{ color: "#8B3A2A" }}>
            {totalTime} min total
          </span>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-2"
          style={{ color: "#6B5140" }}
        >
          {recipe.description}
        </p>
        {recipe.videoUrl && (
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ border: "1px solid #E0D2B4" }}
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" /* 16:9 */ }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(recipe.videoUrl)}`}
                title="Recipe video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 md:px-8 lg:px-14 xl:px-20 py-6 max-w-4xl mx-auto">
        {/* ── Shop ingredients CTA ── */}
        {recipe.linkedProducts?.length > 0 && (
          <div
            className="flex items-center justify-between p-4 rounded-2xl mb-6"
            style={{ background: "#8B3A2A12", border: "1px solid #8B3A2A30" }}
          >
            <div>
              <p className="text-sm font-bold" style={{ color: "#1E1008" }}>
                Shop ingredients
              </p>
            </div>
            <button
              onClick={handleAddAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#8B3A2A", color: "#FFECD0" }}
            >
              <ShoppingBasket size={14} /> Add all
            </button>
          </div>
        )}

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 py-2 mb-6">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, #C4A882, transparent)",
            }}
          />
          <ChefHat size={16} style={{ color: "#8B3A2A" }} />
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, #C4A882, transparent)",
            }}
          />
        </div>

        {/* ── Ingredients ── */}
        <h2
          className="text-lg font-bold mb-3"
          style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
        >
          Ingredients
          <span
            className="text-sm font-normal ml-2"
            style={{ color: "#9A8060" }}
          >
            ({recipe.ingredients.length} items)
          </span>
        </h2>
        <div className="flex flex-col gap-2 mb-8">
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-4 py-3 rounded-xl text-sm"
              style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
            >
              <span style={{ color: "#1E1008" }}>{ing.name}</span>
              <span className="font-semibold" style={{ color: "#8B3A2A" }}>
                {ing.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* ── Steps with progress ── */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
          >
            Steps
          </h2>
          {checkedSteps.length > 0 && (
            <div
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ background: "#8B3A2A18", color: "#8B3A2A" }}
            >
              {completionPct}%
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden mb-4"
          style={{ background: "#E0D2B4" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${completionPct}%`,
              background: "linear-gradient(to right, #C4714A, #8B3A2A)",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {recipe.steps.map((step, i) => {
            const isChecked = checkedSteps.includes(i);
            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleStep(i)}
                className="step-row cursor-pointer flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: isChecked ? "#F5ECD8" : "#FEFAF2",
                  border: `1px solid ${isChecked ? "#C4A882" : "#E0D2B4"}`,
                }}
              >
                {/* Checkbox */}
                <div
                  className="shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5"
                  style={{
                    background: isChecked ? "#8B3A2A" : "transparent",
                    borderColor: isChecked ? "#8B3A2A" : "#C4A882",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isChecked && <Check size={13} color="#FFECD0" />}
                </div>
                <div
                  style={{
                    opacity: isChecked ? 0.55 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <p
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#8B3A2A" }}
                  >
                    Step {step.stepNumber}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "#1E1008",
                      textDecoration: isChecked ? "line-through" : "none",
                    }}
                  >
                    {step.instruction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Linked products grid ── */}
        {recipe.linkedProducts?.length > 0 && (
          <>
            <div className="flex items-center gap-4 py-2 mb-4">
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C4A882, transparent)",
                }}
              />
              <ShoppingBasket size={14} style={{ color: "#8B3A2A" }} />
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C4A882, transparent)",
                }}
              />
            </div>
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
            >
              Shop the ingredients
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {recipe.linkedProducts.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl p-3 flex flex-col items-center text-center"
                  style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
                >
                  <img
                    src={p.image?.[0]}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-xl mb-2"
                  />
                  <p
                    className="text-xs font-semibold mb-0.5 line-clamp-2"
                    style={{ color: "#1E1008" }}
                  >
                    {p.name}
                  </p>
                  <p className="text-xs mb-2" style={{ color: "#8B3A2A" }}>
                    ₹{p.offerPrice || p.price}
                  </p>
                  <button
                    onClick={() => {
                      addToCart(p._id);
                      toast.success("Added to basket");
                    }}
                    className="w-full text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                    style={{ background: "#8B3A2A", color: "#FFECD0" }}
                  >
                    Add to basket
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Reviews ── */}
        <div ref={reviewsRef} className="space-y-5">
          <div className="flex items-center gap-4 py-2">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, #C4A882, transparent)",
              }}
            />
            <ChefHat size={16} style={{ color: "#8B3A2A" }} />
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, #C4A882, transparent)",
              }}
            />
          </div>
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
          >
            Community Feedback
          </h2>
          <ReviewForm
            targetType="communityRecipe"
            targetId={id}
            onSubmitted={() => {
              invalidateReviewSummary("communityRecipe", id);
              fetchReviewSummary("communityRecipe", id);
              setReviewRefresh((r) => r + 1);
            }}
          />
          <ReviewList
            targetType="communityRecipe"
            targetId={id}
            refreshTrigger={reviewRefresh} // ← confirm this is here
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityRecipeDetail;
