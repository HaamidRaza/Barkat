import { useRecipeContext } from "../../context/RecipeContext";
import { useNavigate } from "react-router-dom";
import { Heart, BookOpen, ArrowLeft } from "lucide-react";

const SavedRecipes = () => {
  const { favouritesList, toggleFavourite } = useRecipeContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-14 py-8"
      style={{ background: "#FAF5EC", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <button onClick={() => navigate("/recipes")}
        className="flex items-center gap-2 text-sm font-semibold mb-6"
        style={{ color: "#8B3A2A" }}>
        <ArrowLeft size={14} /> Back to Recipes
      </button>

      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
        Saved Recipes
      </h1>

      {favouritesList.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <Heart size={32} style={{ color: "#C8B89A" }} />
          <p className="font-semibold" style={{ color: "#6B5140" }}>No saved recipes yet</p>
          <button onClick={() => navigate("/recipes")}
            className="text-sm font-semibold px-4 py-2 rounded-xl"
            style={{ background: "#8B3A2A", color: "#FFECD0" }}>
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favouritesList.map(recipe => (
            <div key={recipe.id}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
              onClick={() => navigate(`/recipes/${recipe.id}`)}>
              <div className="relative aspect-square overflow-hidden">
                <img src={recipe.image_url} alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={e => { e.stopPropagation(); toggleFavourite(recipe); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "#8B3A2A" }}>
                  <Heart size={13} fill="#FFECD0" stroke="#FFECD0" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#9A8060] uppercase tracking-wide mb-0.5">
                  {recipe.publisher}
                </p>
                <p className="text-sm font-bold text-[#1E1008] line-clamp-2"
                  style={{ fontFamily: "'Lora', serif" }}>
                  {recipe.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;