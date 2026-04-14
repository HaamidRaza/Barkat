import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import {
  ShoppingBasket,
  Plus,
  Minus,
  Heart,
  Star,
  Leaf,
  Search,
} from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products, cartItems, addToCart, removeFromCart } = useAppContext();
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);

  const searchCategory = categories.find(
    (item) => item.name.toLowerCase() === decodedCategory.toLowerCase(),
  );

  const filterProducts = products.filter(
    (p) =>
      p.category && p.category.toLowerCase() === decodedCategory.toLowerCase(),
  );

  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-8 min-h-screen">
      {/* Category Hero */}
      {searchCategory && (
        <div
          className="relative w-full rounded-2xl overflow-hidden mb-8 flex items-end"
          style={{ minHeight: 180 }}
        >
          {/* Cover image */}
          <img
            src={searchCategory.image}
            alt={searchCategory.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(1.06) brightness(0.82) sepia(0.08)" }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(42,26,26,0.75) 0%, rgba(42,26,26,0.1) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 py-7 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Leaf size={11} className="text-primary-alt" />
              <span className="text-[10px] font-bold text-primary-alt uppercase tracking-widest font-['Inter']">
                Browse Category
              </span>
            </div>
            <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#F6F1E7] leading-tight">
              {searchCategory.name}
            </h1>
            {searchCategory.subtitle && (
              <p className="text-sm text-[#C8B89A] font-['Inter']">
                {searchCategory.subtitle}
              </p>
            )}
            <p className="text-xs text-[#9A8A7A] font-['Inter'] mt-0.5">
              {filterProducts.length} product
              {filterProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
      )}

      {/* Products grid */}
      {filterProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDE6D6] flex items-center justify-center">
            <Search size={24} className="text-[#B0A090]" />
          </div>
          <div>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#2A1A1A]">
              No products in this category
            </p>
            <p className="text-sm text-[#7A6A5A] font-['Inter'] mt-1">
              Check back soon — we restock daily from local vendors
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Results label */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-4 h-px bg-primary-alt" />
            <p className="text-xs text-[#7A6A5A] font-['Inter']">
              Showing{" "}
              <span className="font-semibold text-[#2A1A1A]">
                {filterProducts.length}
              </span>{" "}
              items
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filterProducts.map((item) => (
              <ProductCard key={item.id || item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCategory;
