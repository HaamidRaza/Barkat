import { useState } from "react";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAppContext } from "../../context/AppContext";
import { Search, Heart, BookOpen, Loader2, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const SUGGESTIONS = ["pasta", "chicken", "biryani", "salad", "soup", "pizza", "dal"];

const RecipeList = () => {
  const { searchParam, setSearchParam, loading, recipeList, searchRecipes, toggleFavourite, favouritesList } = useRecipeContext();
  const { navigate } = useAppContext();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes(input);
    setSearchParam(input);
  };

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-14 xl:px-20 py-8"
      style={{ backgroundColor: "#FAF5EC", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen size={14} className="text-[#8B3A2A]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A8060]">Recipes</span>
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", color: "#1E1008", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700 }}>
          What are you cooking today?
        </h1>
        <p className="text-sm mt-2" style={{ color: "#9A8060" }}>
          Search recipes and add ingredients straight to your basket
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mx-auto mb-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: "#FEFAF2", border: "1.5px solid #D9C9A8" }}>
          <Search size={15} style={{ color: "#B8A48A" }} />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search recipes..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#1E1008", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
        <button type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#8B3A2A", color: "#FFECD0", border: "none" }}>
          Search
        </button>
      </form>

      {/* Suggestions */}
      <div className="flex items-center gap-2 justify-center flex-wrap mb-8">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => { setInput(s); searchRecipes(s); }}
            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
            style={{ background: "#EDE4CE", color: "#6B5140", border: "1px solid #D9C9A8" }}>
            {s}
          </button>
        ))}
        <Link to="/recipes/saved"
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: "#8B3A2A12", color: "#8B3A2A", border: "1px solid #8B3A2A30" }}>
          <Heart size={11} /> Saved ({favouritesList.length})
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "#8B3A2A" }} />
        </div>
      )}

      {/* Results */}
      {!loading && recipeList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recipeList.map(recipe => {
            const isFav = favouritesList.find(r => r.id === recipe.id);
            return (
              <div key={recipe.id}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{ background: "#FEFAF2", border: "1px solid #E0D2B4", boxShadow: "0 2px 8px #1E100810" }}>
                <div className="relative" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                  <img src={recipe.image_url} alt={recipe.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavourite(recipe); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: isFav ? "#8B3A2A" : "#FEFAF2CC" }}>
                    <Heart size={13} fill={isFav ? "#FFECD0" : "none"}
                      stroke={isFav ? "#FFECD0" : "#8B3A2A"} />
                  </button>
                </div>
                <div className="p-3" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                  <p className="text-sm font-semibold line-clamp-2 leading-snug"
                    style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
                    {recipe.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9A8060" }}>{recipe.publisher}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && recipeList.length === 0 && searchParam && (
        <div className="text-center py-20">
          <p style={{ fontFamily: "'Lora', serif", color: "#1E1008", fontSize: 18, fontWeight: 700 }}>
            No recipes found
          </p>
          <p className="text-sm mt-1" style={{ color: "#9A8060" }}>Try a different search term</p>
        </div>
      )}

      {/* Initial state */}
      {!loading && recipeList.length === 0 && !searchParam && (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto mb-3" style={{ color: "#D9C9A8" }} />
          <p style={{ fontFamily: "'Lora', serif", color: "#9A8060", fontSize: 16 }}>
            Search for a recipe to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;