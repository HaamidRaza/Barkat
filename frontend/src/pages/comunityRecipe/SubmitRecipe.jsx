import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../config/api.js";

const SubmitRecipe = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    prepTime: "",
    cookTime: "",
  });
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: "" }]);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoError, setVideoError] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIngredientPaste, setShowIngredientPaste] = useState(false);
  const [showStepPaste, setShowStepPaste] = useState(false);
  const [ingredientPasteText, setIngredientPasteText] = useState("");
  const [stepPasteText, setStepPasteText] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const parseIngredientsPaste = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Remove bullet/dash/star prefix
        line = line.replace(/^[\*\-•·]\s*/, "").trim();

        // Split on " – ", " - ", " — ", or last occurrence of " – "
        const separators = [" – ", " — ", " - "];
        let name = line;
        let quantity = "";

        for (const sep of separators) {
          const idx = line.indexOf(sep);
          if (idx !== -1) {
            name = line.substring(0, idx).trim();
            quantity = line.substring(idx + sep.length).trim();
            break;
          }
        }

        // Fallback: split on first comma if no dash found
        if (!quantity && line.includes(",")) {
          const parts = line.split(",");
          name = parts[0].trim();
          quantity = parts.slice(1).join(",").trim();
        }

        return { name, quantity };
      })
      .filter((ing) => ing.name.length > 0);
  };

  const parseStepsPaste = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => {
        // Remove numbering like "1.", "1)", "Step 1:", "Step 1 -"
        line = line.replace(/^(step\s*)?\d+[\.\)\-\:]\s*/i, "").trim();
        // Remove bullet/dash prefix
        line = line.replace(/^[\*\-•·]\s*/, "").trim();
        return { stepNumber: idx + 1, instruction: line };
      })
      .filter((s) => s.instruction.length > 0);
  };

  const updateIngredient = (i, field, val) => {
    const updated = [...ingredients];
    updated[i][field] = val;
    setIngredients(updated);
  };

  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  const removeIngredient = (i) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i));

  const updateStep = (i, val) => {
    const updated = [...steps];
    updated[i].instruction = val;
    setSteps(updated);
  };

  const addStep = () =>
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: "" }]);
  const removeStep = (i) =>
    setSteps(
      steps
        .filter((_, idx) => idx !== i)
        .map((s, idx) => ({ ...s, stepNumber: idx + 1 })),
    );

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const searchProducts = async (query) => {
    setProductSearch(query);
    if (query.length < 2) return setSearchResults([]);
    try {
      const { data } = await axios.get(`/product/list`);
      if (data.success) {
        const filtered = data.products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        );
        setSearchResults(filtered.slice(0, 5));
      }
    } catch {
      setSearchResults([]);
    }
  };

  const addLinkedProduct = (product) => {
    if (linkedProducts.find((p) => p._id === product._id)) return;
    setLinkedProducts((prev) => [...prev, product]);
    setProductSearch("");
    setSearchResults([]);
  };

  const removeLinkedProduct = (id) =>
    setLinkedProducts((prev) => prev.filter((p) => p._id !== id));

  const validateYouTube = (url) => {
    if (!url) return true;
    return /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(
      url,
    );
  };

  const handleVideoUrl = (e) => {
    const val = e.target.value;
    setVideoUrl(val);
    if (val && !validateYouTube(val)) {
      setVideoError("Please enter a valid YouTube URL");
    } else {
      setVideoError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.prepTime || !form.cookTime)
      return toast.error("Please fill all required fields");
    if (ingredients.some((i) => !i.name || !i.quantity))
      return toast.error("Complete all ingredient fields");
    if (steps.some((s) => !s.instruction))
      return toast.error("Complete all step fields");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("prepTime", form.prepTime);
      fd.append("cookTime", form.cookTime);
      fd.append(
        "linkedProducts",
        JSON.stringify(linkedProducts.map((p) => p._id)),
      );
      fd.append("ingredients", JSON.stringify(ingredients));
      fd.append("steps", JSON.stringify(steps));
      fd.append("videoUrl", videoUrl);
      if (photo) fd.append("photo", photo);
      if (videoUrl && !validateYouTube(videoUrl))
        return toast.error("Invalid YouTube URL");
      const { data } = await axios.post(`/recipe/submit`, fd, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success("Recipe submitted! It will go live after review.");
        navigate("/my-recipes");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 mb-10">
      <h1 className="text-2xl font-semibold mb-6">Submit a Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <input
            className="w-full border border-background rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            placeholder="Recipe title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full border border-background rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Short description *"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              className="w-full border border-background rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Prep time (mins) *"
              value={form.prepTime}
              onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
            />
            <input
              type="number"
              min="1"
              className="w-full border border-background rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Cook time (mins) *"
              value={form.cookTime}
              onChange={(e) => setForm({ ...form, cookTime: e.target.value })}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Photo</p>

          {/* Preview */}
          {preview && (
            <div
              className="relative mb-3 rounded-2xl overflow-hidden group"
              style={{ border: "1px solid #E0D2B4", maxHeight: 220 }}
            >
              <img
                src={preview}
                alt="preview"
                className="w-full object-cover"
                style={{ maxHeight: 220 }}
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPreview("");
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "#8B3A2A", color: "#fff" }}
              >
                ✕
              </button>
              <span
                className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#C8920A", color: "#fff" }}
              >
                MAIN PHOTO
              </span>
            </div>
          )}

          {/* Drop zone — hide after photo selected */}
          {!preview && (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = Array.from(e.dataTransfer.files).find((f) =>
                  f.type.startsWith("image/"),
                );
                if (file) {
                  setPhoto(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer transition-all duration-150 py-8 px-4"
              style={{
                border: `2px dashed ${dragOver ? "#8B3A2A" : "#D9C9A8"}`,
                background: dragOver ? "#8B3A2A08" : "#FEFAF2",
              }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "#EDE4CE" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B3A2A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: "#6B5140" }}>
                Drop image here or{" "}
                <span style={{ color: "#8B3A2A" }}>browse</span>
              </p>
              <p className="text-xs" style={{ color: "#B8A48A" }}>
                PNG, JPG, WEBP
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          )}

          {/* Change photo button — shown after upload */}
          {preview && (
            <label
              className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer w-full transition-all"
              style={{ background: "#EDE4CE", color: "#6B5140" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Change photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Ingredients *</p>
            <button
              type="button"
              onClick={() => setShowIngredientPaste((p) => !p)}
              className="text-xs px-3 py-1 cursor-pointer rounded-full transition-all"
              style={{ background: "#EDE4CE", color: "#6B5140" }}
            >
              {showIngredientPaste ? "← Back to manual" : "Paste a list"}
            </button>
          </div>

          {showIngredientPaste ? (
            <div className="space-y-2">
              <textarea
                className="w-full border border-background rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder={
                  "Paste your list here, one per line:\n* Mutton – 500g\n* Basmati rice – 2 cups\n* Onion – 2 large"
                }
                rows={8}
                value={ingredientPasteText}
                onChange={(e) => setIngredientPasteText(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  const parsed = parseIngredientsPaste(ingredientPasteText);
                  if (!parsed.length)
                    return toast.error("Couldn't parse any ingredients");
                  setIngredients(parsed);
                  setShowIngredientPaste(false);
                  setIngredientPasteText("");
                  toast.success(`${parsed.length} ingredients added!`);
                }}
                className="w-full py-2 rounded-lg text-sm font-medium"
                style={{ background: "#8B3A2A", color: "#FFECD0" }}
              >
                Parse & add{" "}
                {ingredientPasteText
                  ? `(${parseIngredientsPaste(ingredientPasteText).length} detected)`
                  : ""}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border border-background rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(i, "name", e.target.value)
                    }
                  />
                  <input
                    className="w-28 border border-background rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Qty"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(i, "quantity", e.target.value)
                    }
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="text-red-400 text-lg px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="mt-1 text-sm"
                style={{ color: "#8B3A2A" }}
              >
                + Add ingredient
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Steps *</p>
            <button
              type="button"
              onClick={() => setShowStepPaste((p) => !p)}
              className="text-xs px-3 py-1 cursor-pointer rounded-full transition-all"
              style={{ background: "#EDE4CE", color: "#6B5140" }}
            >
              {showStepPaste ? "← Back to manual" : "Paste a list"}
            </button>
          </div>

          {showStepPaste ? (
            <div className="space-y-2">
              <textarea
                className="w-full border border-background rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder={
                  "Paste steps here, one per line:\n1. Wash and soak the rice\n2. Fry the onions until golden\n3. Add the marinated meat"
                }
                rows={8}
                value={stepPasteText}
                onChange={(e) => setStepPasteText(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  const parsed = parseStepsPaste(stepPasteText);
                  if (!parsed.length)
                    return toast.error("Couldn't parse any steps");
                  setSteps(parsed);
                  setShowStepPaste(false);
                  setStepPasteText("");
                  toast.success(`${parsed.length} steps added!`);
                }}
                className="w-full py-2 rounded-lg text-sm font-medium"
                style={{ background: "#8B3A2A", color: "#FFECD0" }}
              >
                Parse & add{" "}
                {stepPasteText
                  ? `(${parseStepsPaste(stepPasteText).length} detected)`
                  : ""}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span
                    className="mt-2 text-sm w-5"
                    style={{ color: "#9A8060" }}
                  >
                    {i + 1}.
                  </span>
                  <textarea
                    className="flex-1 border border-background rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder={`Step ${i + 1}`}
                    rows={2}
                    value={step.instruction}
                    onChange={(e) => updateStep(i, e.target.value)}
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="text-red-400 text-lg px-1 mt-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="mt-1 text-sm"
                style={{ color: "#8B3A2A" }}
              >
                + Add step
              </button>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium mb-2">
            Link products from shop{" "}
            <span style={{ color: "#9A8060" }}>(optional)</span>
          </p>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products to link..."
              value={productSearch}
              onChange={(e) => searchProducts(e.target.value)}
              className="w-full border border-background rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            {searchResults.length > 0 && (
              <div
                className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden shadow-lg"
                style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
              >
                {searchResults.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => addLinkedProduct(p)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#EDE4CE] transition-colors"
                  >
                    <img
                      src={p.image?.[0]}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#1E1008" }}
                      >
                        {p.name}
                      </p>
                      <p className="text-xs" style={{ color: "#8B3A2A" }}>
                        ₹{p.offerPrice || p.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected products */}
          {linkedProducts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {linkedProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "#EDE4CE", color: "#6B5140" }}
                >
                  <img
                    src={p.image?.[0]}
                    alt={p.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  {p.name}
                  <button
                    type="button"
                    onClick={() => removeLinkedProduct(p._id)}
                    className="ml-1 text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Recipe video{" "}
            <span style={{ color: "#9A8060" }}>(YouTube link, optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={handleVideoUrl}
            className="w-full border border-background rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
            style={videoError ? { borderColor: "#E53935" } : {}}
          />
          {videoError && (
            <p className="text-xs mt-1" style={{ color: "#E53935" }}>
              {videoError}
            </p>
          )}
          {videoUrl && !videoError && (
            <p className="text-xs mt-1" style={{ color: "#27AE60" }}>
              ✓ Valid YouTube URL
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/95 cursor-pointer text-white py-3 rounded-lg text-sm font-medium transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>
    </div>
  );
};

export default SubmitRecipe;
