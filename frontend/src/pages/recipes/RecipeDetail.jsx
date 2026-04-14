import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAppContext } from "../../context/AppContext";
import {
  ArrowLeft,
  Heart,
  ShoppingBasket,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  ChefHat,
  Check,
} from "lucide-react";

const RecipeDetail = () => {
  const { id } = useParams();
  const {
    recipeDetails,
    fetchRecipeDetail,
    loading,
    toggleFavourite,
    favouritesList,
    matchIngredientToProducts,
    addIngredientsToCart,
  } = useRecipeContext();
  const { navigate } = useAppContext();

  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const isFav = favouritesList.find((r) => r.id === id);

  useEffect(() => {
    fetchRecipeDetail(id);
    setCheckedIngredients([]);
    setCheckedSteps([]);
  }, [id]);

  const toggleIngredient = (i) =>
    setCheckedIngredients((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  const toggleStep = (i) =>
    setCheckedSteps((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  // Parse instructions string into steps array
  const parsedSteps = recipeDetails?.instructions
    ? recipeDetails.instructions
        .split(/\r\n|\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const ingCompletion = recipeDetails?.ingredients?.length
    ? Math.round(
        (checkedIngredients.length / recipeDetails.ingredients.length) * 100,
      )
    : 0;

  const stepCompletion = parsedSteps.length
    ? Math.round((checkedSteps.length / parsedSteps.length) * 100)
    : 0;

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

  if (!recipeDetails) return null;

  const isMealDB = recipeDetails.source === "mealdb";

  return (
    <div
      className="min-h-screen pb-12"
      style={{ background: "#FAF5EC", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .ing-row, .step-row { transition: all 0.2s ease; }
        .back-btn:hover .back-arrow { transform: translateX(-3px); }
        .back-arrow { transition: transform 0.2s ease; }
      `}</style>

      {/* ── Constrained image layout ── */}
      <div className="px-4 md:px-8 lg:px-14 xl:px-20 pt-6 max-w-4xl mx-auto">
        {/* Nav row */}
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
          <div className="flex items-center gap-2">
            {recipeDetails.source_url && (
              <a
                href={recipeDetails.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: "#FEFAF2",
                  border: "1px solid #E0D2B4",
                  color: "#8B3A2A",
                }}
              >
                <ExternalLink size={12} /> Full Recipe
              </a>
            )}
            <button
              onClick={() =>
                toggleFavourite({
                  id,
                  title: recipeDetails.title,
                  image_url: recipeDetails.image_url,
                  publisher: recipeDetails.publisher,
                })
              }
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: isFav ? "#8B3A2A" : "#FEFAF2",
                border: "1px solid #E0D2B4",
                transition: "all 0.3s ease",
              }}
            >
              <Heart
                size={15}
                fill={isFav ? "#FFECD0" : "none"}
                stroke={isFav ? "#FFECD0" : "#8B3A2A"}
              />
            </button>
          </div>
        </div>

        {/* Image */}
        {recipeDetails.image_url && (
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ border: "1px solid #E0D2B4", maxHeight: "420px" }}
          >
            <img
              src={recipeDetails.image_url}
              alt={recipeDetails.title}
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

        {/* Source badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "#8B3A2A18", color: "#8B3A2A" }}
        >
          {isMealDB ? "MealDB" : recipeDetails.publisher}
          {recipeDetails.area && ` · ${recipeDetails.area}`}
          {recipeDetails.category && ` · ${recipeDetails.category}`}
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
        >
          {recipeDetails.title}
        </h1>

        {/* Meta strip */}
        <div
          className="flex items-center gap-4 mb-6 flex-wrap text-sm"
          style={{ color: "#6B5140" }}
        >
          {recipeDetails.cooking_time && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} style={{ color: "#8B3A2A" }} />
              {recipeDetails.cooking_time} min
            </div>
          )}
          {recipeDetails.servings && (
            <div className="flex items-center gap-1.5">
              <Users size={13} style={{ color: "#8B3A2A" }} />
              {recipeDetails.servings} servings
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 md:px-8 lg:px-14 xl:px-20 max-w-4xl mx-auto">
        {/* Shop ingredients CTA */}
        <div
          className="flex items-center justify-between p-4 rounded-2xl mb-6"
          style={{ background: "#8B3A2A12", border: "1px solid #8B3A2A30" }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: "#1E1008" }}>
              Shop ingredients
            </p>
            <p className="text-xs" style={{ color: "#9A8060" }}>
              Add all available ingredients to your basket
            </p>
          </div>
          <button
            onClick={() => addIngredientsToCart(recipeDetails.ingredients)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "#8B3A2A", color: "#FFECD0" }}
          >
            <ShoppingBasket size={14} /> Add all
          </button>
        </div>

        {/* Divider */}
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
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
          >
            Ingredients
            <span
              className="text-sm font-normal ml-2"
              style={{ color: "#9A8060" }}
            >
              ({recipeDetails.ingredients.length} items)
            </span>
          </h2>
          {checkedIngredients.length > 0 && (
            <div
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ background: "#8B3A2A18", color: "#8B3A2A" }}
            >
              {ingCompletion}%
            </div>
          )}
        </div>

        {/* Ingredient progress bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden mb-4"
          style={{ background: "#E0D2B4" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${ingCompletion}%`,
              background: "linear-gradient(to right, #C4714A, #8B3A2A)",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {recipeDetails.ingredients.map((ing, i) => {
            const matches = matchIngredientToProducts(ing.description);
            const hasMatch = matches.length > 0;
            const isChecked = checkedIngredients.includes(i);

            return (
              <div
                key={i}
                onClick={() => toggleIngredient(i)}
                className="ing-row cursor-pointer flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: isChecked ? "#F5ECD8" : "#FEFAF2",
                  border: `1px solid ${isChecked ? "#C4A882" : "#E0D2B4"}`,
                }}
              >
                <div
                  className="shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center"
                  style={{
                    background: isChecked ? "#8B3A2A" : "transparent",
                    borderColor: isChecked ? "#8B3A2A" : "#C4A882",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isChecked && <Check size={13} color="#FFECD0" />}
                </div>

                <div
                  className="flex-1 min-w-0"
                  style={{
                    opacity: isChecked ? 0.55 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {ing.quantity || ing.unit ? (
                    <>
                      <p
                        className="text-xs font-bold"
                        style={{ color: "#8B3A2A" }}
                      >
                        {ing.quantity} {ing.unit}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: "#1E1008",
                          textDecoration: isChecked ? "line-through" : "none",
                        }}
                      >
                        {ing.description}
                      </p>
                    </>
                  ) : (
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: "#1E1008",
                        textDecoration: isChecked ? "line-through" : "none",
                      }}
                    >
                      {ing.description}
                    </p>
                  )}
                </div>

                {hasMatch ? (
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={matches[0].image?.[0]}
                      alt={matches[0].name}
                      className="w-8 h-8 rounded-lg object-cover"
                      style={{ border: "1px solid #E0D2B4" }}
                    />
                    <div className="hidden sm:block">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "#1E1008" }}
                      >
                        {matches[0].name}
                      </p>
                      <p className="text-xs" style={{ color: "#8B3A2A" }}>
                        ₹{matches[0].offerPrice || matches[0].price}
                      </p>
                    </div>
                    <CheckCircle2 size={14} style={{ color: "#3F7D3A" }} />
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <XCircle size={14} style={{ color: "#C8B89A" }} />
                    <button
                      onClick={() => navigate("/products")}
                      className="text-xs font-medium hidden sm:block"
                      style={{ color: "#9A8060" }}
                    >
                      Browse store
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Steps ── */}
        {parsedSteps.length > 0 && (
          <>
            <div className="flex items-center gap-4 py-2 mb-4">
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

            <div className="flex items-center justify-between mb-3">
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
              >
                Instructions
              </h2>
              {checkedSteps.length > 0 && (
                <div
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: "#8B3A2A18", color: "#8B3A2A" }}
                >
                  {stepCompletion}%
                </div>
              )}
            </div>

            {/* Steps progress bar */}
            <div
              className="h-1.5 rounded-full overflow-hidden mb-4"
              style={{ background: "#E0D2B4" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${stepCompletion}%`,
                  background: "linear-gradient(to right, #C4714A, #8B3A2A)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            <div className="flex flex-col gap-3">
              {parsedSteps.map((step, i) => {
                const isChecked = checkedSteps.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => toggleStep(i)}
                    className="step-row cursor-pointer flex items-start gap-3 p-3 rounded-xl"
                    style={{
                      background: isChecked ? "#F5ECD8" : "#FEFAF2",
                      border: `1px solid ${isChecked ? "#C4A882" : "#E0D2B4"}`,
                    }}
                  >
                    <div
                      className="shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5"
                      style={{
                        background: isChecked ? "#8B3A2A" : "transparent",
                        borderColor: isChecked ? "#8B3A2A" : "#C4A882",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isChecked ? (
                        <Check size={13} color="#FFECD0" />
                      ) : (
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: "#C4A882" }}
                        >
                          {i + 1}
                        </span>
                      )}
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
                        Step {i + 1}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "#1E1008",
                          textDecoration: isChecked ? "line-through" : "none",
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
