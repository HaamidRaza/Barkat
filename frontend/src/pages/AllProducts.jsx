import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Leaf, SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { sellerCategories } from "../assets/assets.js";

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
  { label: "Name Z–A", value: "name_desc" },
  { label: "Top rated", value: "rating" },
];

const AllProducts = () => {
  const { products, searchQuery, getReviewSummary, fetchAllProductSummaries } =
    useAppContext();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const panelRef = useRef(null);

  const maxPossible = products.length
    ? Math.max(...products.map((p) => p.offerPrice || p.price || 0))
    : 1000;

  useEffect(() => {
    if (products.length) fetchAllProductSummaries(products.map((p) => p._id));
  }, [products]);

  useEffect(() => {
    let list = [...products];

    // Search
    if (searchQuery?.length > 0) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // In stock
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Max price
    if (maxPrice) {
      list = list.filter((p) => (p.offerPrice || p.price) <= Number(maxPrice));
    }

    // Sort
    list.sort((a, b) => {
      const priceA = a.offerPrice || a.price || 0;
      const priceB = b.offerPrice || b.price || 0;
      const sumA = getReviewSummary("product", a._id);
      const sumB = getReviewSummary("product", b._id);
      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "rating")
        return (sumB?.average || 0) - (sumA?.average || 0);
      return 0;
    });

    setFilteredProducts(list);
  }, [products, searchQuery, selectedCategory, sortBy, maxPrice, inStockOnly]);

  const activeFilters = [
    selectedCategory && {
      label: selectedCategory,
      clear: () => setSelectedCategory(""),
    },
    inStockOnly && { label: "In stock", clear: () => setInStockOnly(false) },
    maxPrice && { label: `≤ ₹${maxPrice}`, clear: () => setMaxPrice("") },
    sortBy !== "default" && {
      label: SORT_OPTIONS.find((o) => o.value === sortBy)?.label,
      clear: () => setSortBy("default"),
    },
  ].filter(Boolean);

  const clearAll = () => {
    setSelectedCategory("");
    setSortBy("default");
    setMaxPrice("");
    setInStockOnly(false);
  };

  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Leaf size={12} className="text-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest">
              The Bazaar
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#2A1A1A] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Products
          </h1>
          <p className="text-sm text-[#7A6A5A]">
            {filteredProducts.length} item
            {filteredProducts.length !== 1 ? "s" : ""}
            {searchQuery?.length > 0 && (
              <span>
                {" "}
                for{" "}
                <span className="font-semibold text-primary">
                  "{searchQuery}"
                </span>
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setShowPanel((p) => !p)}
          className="flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 border border-[#D8C9B4] hover:border-primary transition-all rounded-xl text-sm font-medium text-[#5A3E2B] relative"
          style={{ background: showPanel ? "#E4D8C4" : "#EDE6D6" }}
        >
          <SlidersHorizontal size={14} />
          Filter & Sort
          {activeFilters.length > 0 && (
            <span
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: "#8B3A2A", color: "#FFECD0" }}
            >
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {activeFilters.map((f, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: "#EDE4CE", color: "#6B5140" }}
            >
              {f.label}
              <button
                onClick={f.clear}
                className="hover:text-red-500 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs font-medium underline"
            style={{ color: "#8B3A2A" }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter panel */}
      {showPanel && (
        <div
          className="rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
        >
          {/* Category */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#9A8060" }}
            >
              Category
            </p>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl outline-none appearance-none cursor-pointer"
                style={{
                  background: "#FAF5EC",
                  border: "1px solid #D9C9A8",
                  color: "#1E1008",
                }}
              >
                <option value="">All categories</option>
                {sellerCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#9A8060" }}
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#9A8060" }}
            >
              Sort by
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl outline-none appearance-none cursor-pointer"
                style={{
                  background: "#FAF5EC",
                  border: "1px solid #D9C9A8",
                  color: "#1E1008",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#9A8060" }}
              />
            </div>
          </div>

          {/* Max price */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#9A8060" }}
            >
              Max price{" "}
              {maxPrice && (
                <span style={{ color: "#8B3A2A" }}>₹{maxPrice}</span>
              )}
            </p>
            <input
              type="range"
              min="0"
              max={maxPossible}
              step="10"
              value={maxPrice || maxPossible}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value === String(maxPossible) ? "" : e.target.value,
                )
              }
              className="w-full"
              style={{ accentColor: "#8B3A2A" }}
            />
            <div
              className="flex justify-between text-xs mt-1"
              style={{ color: "#B8A48A" }}
            >
              <span>₹0</span>
              <span>₹{maxPossible}</span>
            </div>
          </div>

          {/* In stock toggle */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#9A8060" }}
            >
              Availability
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setInStockOnly((p) => !p)}
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ background: inStockOnly ? "#8B3A2A" : "#D9C9A8" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                  style={{ left: inStockOnly ? "calc(100% - 18px)" : "2px" }}
                />
              </div>
              <span className="text-sm" style={{ color: "#6B5140" }}>
                In stock only
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDE6D6] flex items-center justify-center">
            <Search size={24} className="text-[#B0A090]" />
          </div>
          <div>
            <p
              className="text-lg font-bold text-[#2A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No products found
            </p>
            <p className="text-sm text-[#7A6A5A] mt-1">
              Try a different search or browse all categories
            </p>
          </div>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ background: "#8B3A2A", color: "#FFECD0" }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-3 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id || item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
