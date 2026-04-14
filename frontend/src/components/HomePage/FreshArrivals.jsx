import { useState, useEffect } from "react";
import { ShoppingBasket } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { sellerCategories } from "../../assets/assets.js";

const FreshArrivals = () => {
  const { products, fetchAllProductSummaries } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...sellerCategories.filter((c) =>
    products.some((p) => p.category === c && p.inStock)
  )];

  const filtered = (activeCategory === "All"
    ? products.filter((p) => p.inStock)
    : products.filter((p) => p.category === activeCategory && p.inStock)
  ).slice(0, 10);

  useEffect(() => {
    if (filtered.length) fetchAllProductSummaries(filtered.map((p) => p._id));
  }, [activeCategory, products]);

  if (!products.length) return null;

  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20">

      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShoppingBasket size={12} className="text-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest font-['Inter']">
              The Bazaar
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A]">
            Fresh Arrivals
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "#7A6A5A" }}>
            Browse by category
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-primary-alt hover:text-[#8A6010] transition-colors hidden sm:block mb-1"
        >
          All products →
        </Link>
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={
              activeCategory === cat
                ? { background: "#8B3A2A", color: "#FFECD0" }
                : { background: "#EDE4CE", color: "#6B5140" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product scroll */}
      <div
        className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {filtered.map((item) => (
          <div key={item._id} className="shrink-0 w-44 sm:w-48 md:w-52">
            <ProductCard item={item} />
          </div>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-5 sm:hidden">
        <Link
          to="/products"
          className="block text-center text-sm font-semibold text-primary-alt border border-primary-alt rounded-xl py-2.5 hover:bg-primary-alt/10 transition-all"
        >
          Browse all products →
        </Link>
      </div>
    </div>
  );
};

export default FreshArrivals;