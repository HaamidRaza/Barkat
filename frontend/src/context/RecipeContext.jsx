import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export const RecipeContext = createContext(null);

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

// Normalize MealDB meal → Forkify-like shape
const normalizeMealDB = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        description: `${measure ? measure.trim() + " " : ""}${name.trim()}`,
        quantity: measure?.trim() || "",
        unit: "",
      });
    }
  }
  return {
    id: `mealdb_${meal.idMeal}`,
    title: meal.strMeal,
    image_url: meal.strMealThumb,
    source_url: meal.strSource || "",
    publisher: meal.strArea || meal.strCategory || "MealDB",
    servings: 4,
    cooking_time: 45,
    ingredients,
    instructions: meal.strInstructions,
    category: meal.strCategory,
    area: meal.strArea,
    source: "mealdb",
  };
};

export const RecipeProvider = ({ children }) => {
  const { products, addToCart } = useAppContext();
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeSource, setActiveSource] = useState("all"); // "all" | "forkify" | "mealdb"
  const [mealDBCategories, setMealDBCategories] = useState([]);
  const [favouritesList, setFavouritesList] = useState(() => {
    const stored = localStorage.getItem("barkat_recipe_favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const STOP_WORDS = new Set([
    "pack","packed","prepared","fresh","frozen","dried","whole","sliced",
    "chopped","diced","minced","ground","cooked","raw","large","small",
    "medium","cups","tbsp","tsp","grams","gram","half","quarter","handful",
    "pinch","piece","pieces","slice","slices","about","approx","optional",
    "taste","needed","more","less","warm","cold","hot",
  ]);

  useEffect(() => {
    localStorage.setItem("barkat_recipe_favorites", JSON.stringify(favouritesList));
  }, [favouritesList]);

  // Pre-load MealDB categories for browse UI
  useEffect(() => {
    fetch(`${MEALDB_BASE}/categories.php`)
      .then((r) => r.json())
      .then((data) => setMealDBCategories(data?.categories || []))
      .catch(() => {});
  }, []);

  // ── Search ──────────────────────────────────────────────────────────────────

  const searchForkify = async (query) => {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
    );
    const data = await res.json();
    return (data?.data?.recipes || []).map((r) => ({ ...r, source: "forkify" }));
  };

  const searchMealDB = async (query) => {
    const res = await fetch(`${MEALDB_BASE}/search.php?s=${query}`);
    const data = await res.json();
    return (data?.meals || []).map(normalizeMealDB);
  };

  const searchRecipes = async (query) => {
    if (!query.trim()) return;
    setLoading(true);

    const performSearch = async () => {
      let results = [];
      if (activeSource === "forkify") {
        results = await searchForkify(query);
      } else if (activeSource === "mealdb") {
        results = await searchMealDB(query);
      } else {
        // "all" — fetch both, merge, deduplicate by title
        const [forkifyResults, mealdbResults] = await Promise.allSettled([
          searchForkify(query),
          searchMealDB(query),
        ]);
        const forkify = forkifyResults.status === "fulfilled" ? forkifyResults.value : [];
        const mealdb  = mealdbResults.status  === "fulfilled" ? mealdbResults.value  : [];
        const seen = new Set(forkify.map((r) => r.title.toLowerCase()));
        const deduped = mealdb.filter((r) => !seen.has(r.title.toLowerCase()));
        results = [...forkify, ...deduped];
      }
      if (!results || results.length === 0) {
        throw new Error("No recipes found");
      }
      return results;
    };

    try {
      await toast.promise(
        performSearch(),
        {
          loading: "Searching recipes...",
          success: (results) => {
            setRecipeList(results);
            return `Found ${results.length} recipe${results.length !== 1 ? "s" : ""}!`;
          },
          error: "Failed to fetch recipes",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Browse MealDB by category
  const browseByCategory = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(`${MEALDB_BASE}/filter.php?c=${category}`);
      const data = await res.json();
      const meals = (data?.meals || []).map((m) => ({
        id: `mealdb_${m.idMeal}`,
        title: m.strMeal,
        image_url: m.strMealThumb,
        source: "mealdb",
        publisher: category,
      }));
      setRecipeList(meals);
    } catch {
      toast.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  // ── Detail ──────────────────────────────────────────────────────────────────

  const fetchRecipeDetail = async (id) => {
    setDetailLoading(true);
    try {
      if (id.startsWith("mealdb_")) {
        const mealId = id.replace("mealdb_", "");
        const res = await fetch(`${MEALDB_BASE}/lookup.php?i=${mealId}`);
        const data = await res.json();
        const meal = data?.meals?.[0];
        setRecipeDetails(meal ? normalizeMealDB(meal) : null);
      } else {
        const res = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );
        const data = await res.json();
        setRecipeDetails(data?.data?.recipe
          ? { ...data.data.recipe, source: "forkify" }
          : null
        );
      }
    } catch {
      toast.error("Failed to load recipe");
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Favourites ──────────────────────────────────────────────────────────────

  const toggleFavourite = (recipe) => {
    setFavouritesList((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      if (exists) {
        toast.success("Removed from favourites");
        return prev.filter((r) => r.id !== recipe.id);
      }
      toast.success("Added to favourites!");
      return [...prev, recipe];
    });
  };

  // ── Product matching ────────────────────────────────────────────────────────

  const matchIngredientToProducts = (ingredientStr) => {
    if (!ingredientStr || !products.length) return [];
    const cleaned = ingredientStr
      .toLowerCase()
      .replace(/\d+(\.\d+)?(\/\d+)?\s?(g|kg|ml|l|oz|lb|cups?|tbsps?|tsps?)?\b/g, "")
      .replace(/[^a-z\s]/g, "")
      .trim();

    const words = cleaned
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

    if (!words.length) return [];

    return products
      .map((p) => {
        const pName = p.name.toLowerCase();
        const pCat  = p.category.toLowerCase();
        const score = words.reduce((acc, word) => {
          if (pName.includes(word)) return acc + 2;
          if (pCat.includes(word))  return acc + 1;
          return acc;
        }, 0);
        return { product: p, score };
      })
      .filter(({ score }) => score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ product }) => product);
  };

  const addIngredientsToCart = (ingredients) => {
    let added = 0;
    ingredients.forEach((ing) => {
      const matches = matchIngredientToProducts(ing.description);
      if (matches.length > 0) {
        addToCart(matches[0].id || matches[0]._id);
        added++;
      }
    });
    if (added > 0)
      toast.success(`${added} ingredient${added !== 1 ? "s" : ""} added to basket!`);
    else
      toast.error("No matching products found in store");
  };

  return (
    <RecipeContext.Provider
      value={{
        searchParam, setSearchParam,
        loading, recipeList,
        recipeDetails, detailLoading,
        favouritesList,
        activeSource, setActiveSource,
        mealDBCategories,
        searchRecipes,
        fetchRecipeDetail,
        browseByCategory,
        toggleFavourite,
        matchIngredientToProducts,
        addIngredientsToCart,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => useContext(RecipeContext);