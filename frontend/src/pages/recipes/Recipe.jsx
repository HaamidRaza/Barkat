import { useEffect, useState } from "react";
import { useRecipeContext } from "../../context/RecipeContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Clock,
  Loader2,
  BookOpen,
  ChefHat,
  SlidersHorizontal,
} from "lucide-react";
import axios from "../../config/api.js";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext.jsx";

const SUGGESTIONS = [
  "pasta",
  "chicken",
  "salad",
  "curry",
  "soup",
  "biryani",
  "pizza",
];

const SOURCE_TABS = [
  { key: "all", label: "All" },
  { key: "forkify", label: "Forkify" },
  { key: "mealdb", label: "MealDB" },
  { key: "community", label: "Community" },
];

const Recipes = () => {
  const {
    loading,
    recipeList,
    searchRecipes,
    toggleFavourite,
    favouritesList,
    activeSource,
    setActiveSource,
    mealDBCategories,
    browseByCategory,
  } = useRecipeContext();
  const { getReviewSummary, fetchAllRecipeSummaries } = useAppContext();

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);

  useEffect(() => {
    if (communityRecipes.length) {
      fetchAllRecipeSummaries(communityRecipes.map((r) => r._id));
    }
  }, [communityRecipes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeSource === "community") return;
    searchRecipes(input);
  };

  const handleSourceChange = (key) => {
    setActiveSource(key);
    if (key === "community") {
      setCommunityLoading(true);
      setCommunityRecipes([]);
      axios
        .get("/recipe/approved")
        .then(({ data }) => {
          if (data.success) {
            setCommunityRecipes(data.recipes);
            fetchAllRecipeSummaries(data.recipes.map((r) => r._id));
          } else toast.error(data.message);
          setCommunityLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load community recipes");
          setCommunityLoading(false);
        });
    }
  };

  const isCommunity = activeSource === "community";

  return (
    <div
      className="min-h-screen bg-background/15"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <BookOpen size={12} className="text-[#8B3A2A]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A8060]">
              Recipes
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#1E1008] mb-1"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Find a Recipe
              </h1>
              <p className="text-xs sm:text-sm text-[#9A8060]">
                Search thousands of recipes and add ingredients straight to your
                basket
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
              {recipeList.length > 0 && !isCommunity && (
                <p className="text-xs text-[#9A8060] hidden sm:block">
                  {recipeList.length} recipes found
                </p>
              )}
              {isCommunity && (
                <p className="text-xs text-[#9A8060]">
                  {communityRecipes.length} community recipes
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/recipes/saved")}
                  className="flex items-center text-[#8B3A2A] border-[#8B3A2A] bg-transparent cursor-pointer gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors hover:text-[#EDE4CE] hover:bg-primary hover:border-[#8B3A2A]"
                >
                  <Heart size={14} fill="currentColor" /> Saved
                </button>
                <button
                  onClick={() => navigate("/submit-recipe")}
                  className="flex items-center cursor-pointer gap-1.5 px-3 bg-[#EDE4CE] text-[#6B5140] hover:text-[#EDE4CE] hover:bg-primary py-1.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ChefHat size={13} fill="currentColor" /> Submit yours
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Source tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleSourceChange(tab.key)}
              className="px-4 py-1.5 rounded-full cursor-pointer text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={
                activeSource === tab.key
                  ? { background: "#8B3A2A", color: "#FFECD0" }
                  : { background: "#EDE4CE", color: "#6B5140" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MealDB category strip */}
        {activeSource === "mealdb" && mealDBCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
            {mealDBCategories.map((cat) => (
              <button
                key={cat.idCategory}
                onClick={() => {
                  setInput(cat.strCategory);
                  browseByCategory(cat.strCategory);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors hover:bg-[#E8DBCA]"
                style={{
                  background: "#FEFAF2",
                  border: "1px solid #E0D2B4",
                  color: "#6B5140",
                }}
              >
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="w-5 h-5 rounded-full object-cover"
                />
                {cat.strCategory}
              </button>
            ))}
          </div>
        )}

        {/* Search bar */}
        {!isCommunity && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-3"
            style={{ background: "#FEFAF2", borderColor: "#E0D2B4" }}
          >
            <Search size={14} style={{ color: "#B8A48A", flexShrink: 0 }} />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search recipes e.g. pasta, curry..."
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
              style={{ color: "#1E1008" }}
            />
            <button
              type="submit"
              className="px-3 py-1.5 cursor-pointer rounded-lg text-xs font-semibold shrink-0"
              style={{ background: "#8B3A2A", color: "#FFECD0" }}
            >
              Search
            </button>
          </form>
        )}

        {/* Suggestion chips */}
        {!isCommunity && recipeList.length === 0 && !loading && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-xs text-[#9A8060]">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  searchRecipes(s);
                }}
                className="px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors hover:bg-[#E2D4BA]"
                style={{ background: "#EDE4CE", color: "#6B5140" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── COMMUNITY ── */}
        {isCommunity && (
          <>
            {communityLoading && (
              <div className="flex justify-center py-24">
                <Loader2
                  size={26}
                  className="animate-spin"
                  style={{ color: "#8B3A2A" }}
                />
              </div>
            )}

            {!communityLoading && communityRecipes.length === 0 && (
              <div className="flex flex-col items-center py-24 gap-3 text-center">
                <ChefHat size={34} style={{ color: "#C8B89A" }} />
                <p className="font-semibold text-[#6B5140]">
                  No community recipes yet
                </p>
                <p className="text-sm text-[#9A8060]">
                  Be the first to share one!
                </p>
                <button
                  onClick={() => navigate("/submit-recipe")}
                  className="mt-1 px-5 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "#8B3A2A", color: "#FFECD0" }}
                >
                  Submit a recipe
                </button>
              </div>
            )}

            {!communityLoading && communityRecipes.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {communityRecipes.map((recipe) => {
                    const summary = getReviewSummary(
                      "communityRecipe",
                      recipe._id,
                    );
                    
                    return (
                      <div
                        key={recipe._id}
                        onClick={() =>
                          navigate(`/community-recipes/${recipe._id}`)
                        }
                        className="rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1"
                        style={{
                          background: "#FEFAF2",
                          border: "1px solid #E0D2B4",
                        }}
                      >
                        <div className="relative overflow-hidden aspect-square bg-[#EDE4CE]">
                          {recipe.photo ? (
                            <img
                              src={recipe.photo}
                              alt={recipe.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ChefHat size={28} style={{ color: "#B8A48A" }} />
                            </div>
                          )}
                          <span
                            className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "#8B3A2A", color: "#FFECD0" }}
                          >
                            Community
                          </span>
                          {summary?.total > 0 && (
                            <span
                              className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{
                                background: "#EDFAF3",
                                color: "#1A6B40",
                              }}
                            >
                              ↑ {summary.upvotes}
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 sm:p-3">
                          <p className="text-[10px] font-semibold text-[#9A8060] uppercase tracking-wide mb-0.5 truncate">
                            {recipe.submittedBy?.name || "Anonymous"}
                          </p>
                          <p
                            className="text-xs sm:text-sm font-bold text-[#1E1008] line-clamp-2 leading-snug"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {recipe.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock size={10} style={{ color: "#9A8060" }} />
                            <span className="text-[10px] text-[#9A8060]">
                              {recipe.prepTime + recipe.cookTime} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* ── FORKIFY / MEALDB / ALL ── */}
        {!isCommunity && (
          <>
            {loading && (
              <div className="flex justify-center py-24">
                <Loader2
                  size={26}
                  className="animate-spin"
                  style={{ color: "#8B3A2A" }}
                />
              </div>
            )}

            {!loading && recipeList.length > 0 && (
              <>
                <p className="text-xs text-[#9A8060] mb-3 sm:hidden">
                  {recipeList.length} recipes found
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {recipeList.map((recipe) => {
                    const isFav = favouritesList.find(
                      (r) => r.id === recipe.id,
                    );
                    return (
                      <div
                        key={recipe.id}
                        className="rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1"
                        style={{
                          background: "#FEFAF2",
                          border: "1px solid #E0D2B4",
                        }}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                      >
                        <div className="relative overflow-hidden aspect-square bg-[#EDE4CE]">
                          <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavourite(recipe);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-transform hover:scale-110"
                            style={{
                              background: isFav
                                ? "#8B3A2A"
                                : "rgba(254,250,242,0.6)",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <Heart
                              size={12}
                              fill={isFav ? "#FFECD0" : "none"}
                              stroke={isFav ? "#FFECD0" : "#fff"}
                            />
                          </button>
                          {recipe.source === "mealdb" && (
                            <span
                              className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: "#3A6B8B",
                                color: "#D0EEFF",
                              }}
                            >
                              MealDB
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 sm:p-3">
                          <p className="text-[10px] font-semibold text-[#9A8060] uppercase tracking-wide mb-0.5 truncate">
                            {recipe.publisher}
                          </p>
                          <p
                            className="text-xs sm:text-sm font-bold text-[#1E1008] line-clamp-2 leading-snug"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {recipe.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {!loading && recipeList.length === 0 && input && (
              <div className="flex flex-col items-center py-24 gap-3 text-center">
                <BookOpen size={32} style={{ color: "#C8B89A" }} />
                <p className="font-semibold text-[#6B5140]">
                  No recipes found for "{input}"
                </p>
                <p className="text-sm text-[#9A8060]">
                  Try a different search term
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recipes;
