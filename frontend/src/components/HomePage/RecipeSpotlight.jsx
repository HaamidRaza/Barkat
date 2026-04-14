import { useEffect, useState } from "react";
import { ChefHat, Clock, Heart, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../config/api.js";
import { useAppContext } from "../../context/AppContext";

const MEALDB_FEATURED = ["53049", "52772", "52874", "52897", "52959"];

const RecipeSpotlight = () => {
  const navigate = useNavigate();
  const { getReviewSummary, fetchAllRecipeSummaries } = useAppContext();
  const [favouritesList, setFavouritesList] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("barkat_recipe_favorites") || "[]",
      );
    } catch {
      return [];
    }
  });

  const toggleFavourite = (recipe) => {
    setFavouritesList((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      const updated = exists
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, recipe];
      localStorage.setItem("barkat_recipe_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [mealdbRecipes, setMealdbRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("community");

  useEffect(() => {
    // Community recipes
    axios.get("/recipe/approved").then(({ data }) => {
      if (data.success) {
        const latest = data.recipes.slice(0, 8);
        setCommunityRecipes(latest);
        if (latest.length) fetchAllRecipeSummaries(latest.map((r) => r._id));
      }
    });

    // MealDB featured
    Promise.allSettled(
      MEALDB_FEATURED.map((id) =>
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          .then((r) => r.json())
          .then((d) => d?.meals?.[0]),
      ),
    ).then((results) => {
      const meals = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => ({
          id: `mealdb_${r.value.idMeal}`,
          title: r.value.strMeal,
          image_url: r.value.strMealThumb,
          publisher: r.value.strArea || r.value.strCategory,
          cooking_time: 45,
          source: "mealdb",
        }));
      setMealdbRecipes(meals);
    });
  }, []);

  const displayList =
    activeTab === "community" ? communityRecipes : mealdbRecipes;

  if (!communityRecipes.length && !mealdbRecipes.length) return null;

  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ChefHat size={12} className="text-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest font-['Inter']">
              Recipe Spotlight
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A]">
            Cook Something Great
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "#7A6A5A" }}>
            Recipes from our community and around the world
          </p>
        </div>
        <Link
          to="/recipes"
          className="text-sm font-semibold text-primary-alt hover:text-[#8A6010] transition-colors hidden sm:block mb-1"
        >
          All recipes →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab("community")}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={
            activeTab === "community"
              ? { background: "#8B3A2A", color: "#FFECD0" }
              : { background: "#EDE4CE", color: "#6B5140" }
          }
        >
          <ChefHat size={11} /> Community
          {communityRecipes.length > 0 && (
            <span className="ml-0.5 opacity-70">
              ({communityRecipes.length})
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("mealdb")}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={
            activeTab === "mealdb"
              ? { background: "#3A6B8B", color: "#D0EEFF" }
              : { background: "#EDE4CE", color: "#6B5140" }
          }
        >
          <BookOpen size={11} /> World Recipes
        </button>
      </div>

      {/* Empty community state */}
      {activeTab === "community" && communityRecipes.length === 0 && (
        <div
          className="flex flex-col items-center py-10 gap-3 text-center rounded-2xl"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
        >
          <ChefHat size={28} style={{ color: "#C8B89A" }} />
          <p className="text-sm font-medium" style={{ color: "#6B5140" }}>
            No community recipes yet
          </p>
          <Link
            to="/submit-recipe"
            className="text-xs font-semibold px-4 py-1.5 rounded-xl"
            style={{ background: "#8B3A2A", color: "#FFECD0" }}
          >
            Submit the first one
          </Link>
        </div>
      )}

      {/* Recipe cards scroll */}
      {displayList.length > 0 && (
        <div
          className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {displayList.map((recipe) => {
            const isCommunity = !recipe.source;
            const summary = isCommunity
              ? getReviewSummary("communityRecipe", recipe._id)
              : null;
            const isFav =
              !isCommunity && favouritesList.find((r) => r.id === recipe.id);

            return (
              <div
                key={isCommunity ? recipe._id : recipe.id}
                onClick={() =>
                  navigate(
                    isCommunity
                      ? `/community-recipes/${recipe._id}`
                      : `/recipes/${recipe.id}`,
                  )
                }
                className="shrink-0 w-52 sm:w-56 rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1"
                style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-4/3 bg-[#EDE4CE]">
                  {recipe.photo || recipe.image_url ? (
                    <img
                      src={recipe.photo || recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ChefHat size={24} style={{ color: "#B8A48A" }} />
                    </div>
                  )}

                  {/* Source badge */}
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={
                      isCommunity
                        ? { background: "#8B3A2A", color: "#FFECD0" }
                        : { background: "#3A6B8B", color: "#D0EEFF" }
                    }
                  >
                    {isCommunity ? "Community" : "MealDB"}
                  </span>

                  {/* Fav / vote badge */}
                  {isCommunity && summary?.total > 0 && (
                    <span
                      className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#EDFAF3", color: "#1A6B40" }}
                    >
                      ↑{summary.upvotes}
                    </span>
                  )}
                  {!isCommunity && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(recipe);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                      style={{
                        background: isFav ? "#8B3A2A" : "rgba(254,250,242,0.7)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Heart
                        size={11}
                        fill={isFav ? "#FFECD0" : "none"}
                        stroke={isFav ? "#FFECD0" : "#fff"}
                      />
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="p-3">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide mb-0.5 truncate"
                    style={{ color: "#9A8060" }}
                  >
                    {isCommunity
                      ? recipe.submittedBy?.name || "Anonymous"
                      : recipe.publisher}
                  </p>
                  <p
                    className="text-sm font-bold line-clamp-2 leading-snug mb-1.5"
                    style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
                  >
                    {recipe.title}
                  </p>
                  <div
                    className="flex items-center gap-1"
                    style={{ color: "#9A8060" }}
                  >
                    <Clock size={10} />
                    <span className="text-[10px]">
                      {isCommunity
                        ? `${recipe.prepTime + recipe.cookTime} mins`
                        : `${recipe.cooking_time} mins`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile view all */}
      <div className="mt-5 sm:hidden">
        <Link
          to="/recipes"
          className="block text-center text-sm font-semibold text-primary-alt border border-primary-alt rounded-xl py-2.5 hover:bg-primary-alt/10 transition-all"
        >
          Explore all recipes →
        </Link>
      </div>
    </div>
  );
};

export default RecipeSpotlight;
