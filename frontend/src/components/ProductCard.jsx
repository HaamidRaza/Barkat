import React, { useState, useCallback, useEffect } from "react";
import { ShoppingBasket, Plus, Minus, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import StarRating from "./StarRating";

const BADGE_DOT = {
  "Fresh Today": "bg-emerald-500",
  Popular: "bg-amber-500",
  "Best Value": "bg-rose-500",
  Seasonal: "bg-orange-500",
};

const BADGE_BG = {
  "Fresh Today": "bg-emerald-100 text-emerald-800",
  Popular: "bg-amber-100 text-amber-800",
  "Best Value": "bg-rose-100 text-rose-800",
  Seasonal: "bg-orange-100 text-orange-800",
};

const ProductCard = ({ item }) => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    navigate,
    products,
    fetchAllProductSummaries,
    getReviewSummary,
  } = useAppContext();
  const itemId = item.id || item._id;
  const qty = cartItems?.[itemId] || 0;
  const [added, setAdded] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleAdd = useCallback(
    (e) => {
      e.stopPropagation();
      addToCart(itemId);
      setAdded(true);
      setTimeout(() => setAdded(false), 850);
    },
    [addToCart, itemId],
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      removeFromCart(itemId);
    },
    [removeFromCart, itemId],
  );

  useEffect(() => {
    if (products.length) {
      fetchAllProductSummaries(products.map((p) => p._id));
    }
  }, [products]);

  const summary = getReviewSummary("product", item._id);

  const hasOffer =
    typeof item?.offerPrice === "number" &&
    item.offerPrice > 0 &&
    item.offerPrice < item.price;
  const discount = hasOffer
    ? Math.round((1 - item.offerPrice / item.price) * 100)
    : null;

  const dotColor = BADGE_DOT[item.tag] || BADGE_DOT["Fresh Today"];
  const badgeBg = BADGE_BG[item.tag] || BADGE_BG["Fresh Today"];

  // item.description arrives as flattened [label, value, "", label, value, "", ...]
  // groups split on the empty-string separators into { label, value } pairs
  const specs = [];
  if (Array.isArray(item.description)) {
    let pair = [];
    for (const part of item.description) {
      if (part === "") {
        if (pair.length >= 2) specs.push({ label: pair[0], value: pair[1] });
        pair = [];
      } else {
        pair.push(part);
      }
    }
    if (pair.length >= 2) specs.push({ label: pair[0], value: pair[1] });
  }

  return (
    item.inStock && (
      <div
        onClick={() => {
          navigate(`/products/${item.category.toLowerCase()}/${item._id}`);
          scrollTo(0, 0);
        }}
        className="
        group relative flex flex-col h-full cursor-pointer
        rounded-xl overflow-hidden
        border border-[#E8D8C0]
        bg-[#FAF6EE]
        shadow-[0_1px_6px_rgba(90,52,26,0.08)]
        active:scale-[0.97]
        transition-all duration-150 ease-out
      "
      >
        {/* ── IMAGE ── */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-[#EDE3CC] shrink-0">
          <img
            src={item.image[0]}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: "saturate(1.06) brightness(1.02)" }}
          />

          {/* Soft bottom overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

          {/* Single badge — tag OR discount, tag takes priority */}
          {item.tag ? (
            <span
              className={`absolute top-1.5 left-1.5 flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${badgeBg}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
              />
              {item.tag}
              {discount && (
                <span className="ml-0.5 text-[#B73228]">·{discount}%</span>
              )}
            </span>
          ) : discount ? (
            <span className="absolute top-1.5 left-1.5 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-[#B73228]/90 text-[#FDF6EC]">
              {discount}%
            </span>
          ) : null}

          {/* Rating badge — top-left, only when reviews exist */}
          {summary?.total > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-black/55 text-[#FDF6EC] backdrop-blur-sm">
              <Star
                size={9}
                strokeWidth={0}
                className="fill-amber-400 text-amber-400"
              />
              {summary.average} ({summary.total})
            </span>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-col flex-1 gap-1.5 px-2.5 pt-2 pb-2.5">
          {/* Title — max 2 lines, fixed height so short/long names align */}
          <p className="text-[12.5px] font-bold text-[#2A1408] leading-snug line-clamp-2 font-serif min-h-[2.4em]">
            {item.name}
          </p>

          {/* Subtitle — 1 line max, muted */}
          {item.subtitle && (
            <p className="text-[10.5px] text-[#A08060] leading-none line-clamp-1 -mt-0.5">
              {item.subtitle}
            </p>
          )}

          {/* Spec chips from item.description (e.g. Vegetable, Veg), space always reserved */}
          <div className="h-4 flex items-center gap-1 overflow-hidden">
            {specs.length > 0 ? (
              specs.slice(0, 2).map((spec, i) => (
                <span
                  key={i}
                  className="shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#EDE3CC] text-[#7A5C3E] whitespace-nowrap"
                >
                  {spec.value}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-[#A08060] italic">
                Everyday essential
              </span>
            )}
          </div>

          {/* Price row + circular CTA — pinned to bottom of card */}
          <div className="flex items-center justify-between gap-1.5 mt-auto pt-0.5">
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-[16px] font-extrabold text-[#B73228] leading-none">
                  ₹{item.price}
                </span>
                {item.offerPrice === 0 || item.offerPrice === null ? null : (
                  <span className="text-[10px] text-[#B09880] line-through leading-none">
                    ₹{item.offerPrice}
                  </span>
                )}
              </div>
              {item.unit && (
                <span className="text-[9px] text-[#B09880] whitespace-nowrap leading-none mt-1">
                  {item.unit}
                </span>
              )}
            </div>

            {/* CTA */}
            {qty === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
                onPointerLeave={() => setPressed(false)}
                className={`
                shrink-0 w-9 h-9 cursor-pointer flex items-center justify-center
                rounded-full transition-all duration-150
                ${pressed ? "scale-90" : "scale-100"}
                ${added ? "bg-emerald-600" : "bg-[#B73228] active:bg-[#8E2020]"}
              `}
              >
                {added ? (
                  <Plus
                    size={15}
                    strokeWidth={2.6}
                    className="text-[#FDF6EC]"
                  />
                ) : (
                  <ShoppingBasket
                    size={15}
                    strokeWidth={2.3}
                    className="text-[#FDF6EC]"
                  />
                )}
              </button>
            ) : (
              <div className="shrink-0 flex items-center h-7 rounded-full bg-[#FDF6EC] border border-[#E0C9A6] px-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="w-6 h-6 cursor-pointer flex items-center justify-center rounded-full text-[#B73228] hover:bg-[#F3E4CE] active:scale-90 transition-all"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="w-4 text-center text-[12px] font-bold text-[#2A1408] tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-6 h-6 cursor-pointer flex items-center justify-center rounded-full bg-[#B73228] text-[#FDF6EC] active:bg-[#8E2020] active:scale-90 transition-all"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
