import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingBasket,
  Zap,
  Star,
  Leaf,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  SearchAlertIcon,
  ArrowUpRightFromSquareIcon,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import StarRating from "../components/StarRating";

/* ─── Utility ─────────────────────────────────────────────────────────────── */
const clsx = (...c) => c.filter(Boolean).join(" ");

/* ─── Sub-components ──────────────────────────────────────────────────────── */
const StarRow = ({ rating, reviews }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {Array(5)
        .fill("")
        .map((_, i) => (
          <Star
            key={i}
            size={12}
            fill={rating > i ? "#C8920A" : "none"}
            stroke={rating > i ? "#C8920A" : "#C8B89A"}
            strokeWidth={1.5}
          />
        ))}
    </div>
    <span className="text-xs font-semibold text-[#7A5C3A] font-['Lora']">
      {rating}
    </span>
    {reviews && (
      <span className="text-[11px] text-[#A8907A]">· {reviews} reviews</span>
    )}
  </div>
);

const TrustBadge = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 bg-[#EFE6D2] border border-[#DDD0B8] rounded-lg px-2.5 py-2">
    <span className="text-[#8B6A3A] shrink-0">{icon}</span>
    <span className="text-[10px] font-semibold text-[#6A4A2A] leading-tight font-['Inter']">
      {label}
    </span>
  </div>
);

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#DDD0B8] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F0E8D8] text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-[#3A2210] font-['Lora']">
          {title}
        </span>
        <ChevronDown
          size={15}
          className={clsx(
            "text-[#8B6A3A] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="px-4 py-3 bg-[#FAF5EC]">{children}</div>}
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const Product = () => {
  const {
    user,
    products,
    navigate,
    addToCart,
    removeFromCart,
    cartItems,
    getReviewSummary,
    fetchReviewSummary,
    invalidateReviewSummary,
  } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const reviewsRef = useRef(null);

  const product = products.find(
    (p) => String(p.id) === id || String(p._id) === id,
  );

  const isOwner = user?._id === product?.seller || user?.id === product?.seller;

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products
        .filter(
          (i) =>
            i.category === product.category &&
            i._id !== product.id &&
            i._id !== product._id,
        )
        .slice(0, 5);
      setRelatedProducts(related);
    }
  }, [products, product]);

  useEffect(() => {
    if (product) {
      const first = Array.isArray(product.image)
        ? product.image[0]
        : product.image || null;
      setThumbnail(first);
    }
  }, [product]);

  useEffect(() => {
    if (product?._id) fetchReviewSummary("product", product._id);
  }, [product]);

  if (!product) {
    return (
      <div className="px-4 py-20 flex flex-col items-center gap-4 text-center min-h-screen bg-[#FAF5EC]">
        <div className="w-14 h-14 rounded-full bg-[#EDE6D6] flex items-center justify-center">
          <ShoppingBasket size={22} className="text-[#B0A090]" />
        </div>
        <p className="font-['Lora'] text-xl font-bold text-[#2A1A1A]">
          Product not found
        </p>
        <Link
          to="/products"
          className="text-sm text-[#8B3A2A] font-semibold font-['Inter'] hover:underline"
        >
          Back to all products
        </Link>
      </div>
    );
  }

  const summary = getReviewSummary("product", product._id);

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const qty = cartItems?.[product?.id || product?._id] || 0;
  const itemId = product?.id || product?._id;
  const hasOffer =
    typeof product?.offerPrice === "number" &&
    product.offerPrice > 0 &&
    product.offerPrice < product.price;
  const discount = hasOffer
    ? Math.round((1 - product.offerPrice / product.price) * 100)
    : null;
  const displayPrice = hasOffer ? product.offerPrice : product?.price;
  const displayOriginal = hasOffer ? product?.price : null;

  const descriptionItems = Array.isArray(product.description)
    ? product.description
    : product.description
      ? [product.description]
      : [];

  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      <div className="px-4 md:px-8 lg:px-14 xl:px-20 pt-4 pb-24 md:pb-8 max-w-7xl mx-auto">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1 text-[11px] text-[#9A8A7A] font-['Inter'] mb-5 flex-wrap">
          <Link to="/" className="hover:text-[#8B3A2A] transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link
            to="/products"
            className="hover:text-[#8B3A2A] transition-colors"
          >
            Products
          </Link>
          <ChevronRight size={10} />
          <Link
            to={`/products/${product.category?.toLowerCase()}`}
            className="hover:text-[#8B3A2A] transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={10} />
          <span className="text-[#5A3E2B] font-medium truncate max-w-40">
            {product.name}
          </span>
        </nav>

        {/* ── 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-6 xl:gap-10">
          {/* ════════ LEFT: IMAGE GALLERY ════════ */}
          <div className="flex flex-col gap-2.5">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#EDE6D6] border border-[#D8C9B4] shadow-sm aspect-square group">
              <img
                src={thumbnail}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
                style={{ filter: "saturate(1.05) brightness(1.02)" }}
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {discount && (
                  <span className="bg-[#8B3A2A] text-[#FAF5EC] text-[10px] font-bold px-2.5 py-0.5 rounded-full font-['Inter'] shadow-sm">
                    -{discount}% OFF
                  </span>
                )}
                {product.tag && (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-['Inter'] shadow-sm ${product.tagColor}`}
                  >
                    {product.tag}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail strip (horizontal) */}
            {images.length > 1 && (
              <div className="flex flex-row gap-2 overflow-x-auto pb-0.5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setThumbnail(img)}
                    className={clsx(
                      "w-17 h-17 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-150",
                      thumbnail === img
                        ? "border-[#8B3A2A] opacity-100 shadow-sm"
                        : "border-[#D8C9B4] opacity-60 hover:opacity-90 hover:border-[#B89070]",
                    )}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: "saturate(1.04)" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════════ RIGHT: PRODUCT INFO ════════ */}
          <div className="flex flex-col gap-4">
            {/* 1. Category tag + Title */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 w-max bg-secondary/20 rounded-full px-3 py-1">
                <Leaf size={10} className="text-[#6A8B3A]" />
                <span className="text-[9px] font-bold text-secondary-alt  uppercase tracking-widest font-['Inter']">
                  {product.category}
                </span>
              </div>
              <h1 className="font-['Lora'] text-[26px] sm:text-[30px] font-bold text-[#1E1008] leading-snug">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-[13px] text-[#7A6050] font-['Inter'] -mt-0.5">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* 2. Rating */}
            {summary && summary.total > 0 && (
              <div className="flex items-center gap-2">
                <StarRating
                  value={Math.round(summary.average)}
                  readonly
                  size={14}
                />
                <span
                  className="text-xs text-gray-500 hover:text-primary/70 hover:underline cursor-pointer"
                  onClick={() =>
                    reviewsRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {summary.average} · {summary.total} review
                  {summary.total !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* 3. Price block */}
            <div className="bg-[#EDE4CE] border border-[#D8C9A8] rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <div className="flex items-end gap-2.5 flex-wrap">
                <span className="font-['Lora'] text-[36px] font-bold text-[#8B3A2A] leading-none">
                  ₹{displayPrice}
                </span>
                {product.unit && (
                  <span className="text-[13px] text-[#7A6050] font-['Inter'] pb-1">
                    {product.unit}
                  </span>
                )}
                {displayOriginal && (
                  <div className="flex items-center gap-2 pb-1">
                    <span className="text-sm text-[#9A8070] line-through font-['Inter']">
                      ₹{displayOriginal}
                    </span>
                    <span className="text-[11px] font-bold text-[#3F7D3A] bg-[#E4F0D6] px-2 py-0.5 rounded-full font-['Inter']">
                      Save ₹{displayOriginal - displayPrice}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#9A8070] font-['Inter']">
                Inclusive of all taxes
              </p>
            </div>

            {/* 4. Key Highlights */}
            {descriptionItems.length > 0 &&
              (() => {
                // Parse into [{label, value}] pairs, skip empty strings
                const parsed = [];
                let i = 0;
                while (i < descriptionItems.length) {
                  if (descriptionItems[i] === "") {
                    i++;
                    continue;
                  }
                  const label = descriptionItems[i];
                  const value = descriptionItems[i + 1] ?? "";
                  if (label && value && value !== "")
                    parsed.push({ label, value });
                  i += 2;
                  // skip trailing empty
                  if (descriptionItems[i] === "") i++;
                }

                // If no key-value pairs detected, fall back to bullet list
                const isStructured = parsed.length > 0;

                return isStructured ? (
                  <Accordion title="Product Details" defaultOpen={true}>
                    <div className="flex flex-col divide-y divide-[#E8D8C0]">
                      {parsed.map(({ label, value }, i) => (
                        <div
                          key={i}
                          className="flex gap-3 py-2 text-[13px] font-['Inter']"
                        >
                          <span className="text-[#9A7A5A] font-semibold capitalize min-w-[120px] shrink-0">
                            {label}
                          </span>
                          <span className="text-[#3A2210]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] font-bold text-[#6A5040] uppercase tracking-widest font-['Inter']">
                      Highlights
                    </p>
                    <div className="flex flex-col gap-1">
                      {descriptionItems
                        .filter((d) => d !== "")
                        .map((desc, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-[13px] text-[#4A3020] font-['Inter']"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#C8920A] mt-1.5 shrink-0" />
                            {desc}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })()}

            {/* 5. CTA buttons */}
            <div className="hidden md:flex gap-2">
              {qty === 0 ? (
                <button
                  onClick={() => addToCart(itemId)}
                  className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer bg-[#8B3A2A] hover:bg-[#7A2E20] active:scale-[0.98] transition-all text-[#FAF5EC] text-sm font-bold rounded-xl font-['Inter'] shadow-sm"
                >
                  <ShoppingBasket size={15} />
                  Add to Basket
                </button>
              ) : (
                <div className="flex items-center rounded-xl overflow-hidden border-2 border-[#8B3A2A] w-full h-12">
                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="flex items-center justify-center w-12 h-full bg-[#8B3A2A] hover:bg-[#7A2E20] active:scale-95 transition-all text-[#FAF5EC] shrink-0 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-base font-bold text-[#8B3A2A] font-['Lora']">
                    {qty}
                  </span>
                  <button
                    onClick={() => addToCart(itemId)}
                    className="flex items-center justify-center w-12 h-full bg-[#8B3A2A] hover:bg-[#7A2E20] active:scale-95 transition-all text-[#FAF5EC] shrink-0 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  if (cartItems?.[itemId] === undefined) addToCart(itemId);
                  navigate("/basket");
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-[#8B3A2A] text-[#8B3A2A] hover:bg-[#8B3A2A] hover:text-[#FAF5EC] active:scale-[0.98] transition-all text-sm font-bold rounded-xl font-['Inter'] cursor-pointer"
              >
                <Zap size={14} />
                Buy Now
              </button>
            </div>

            {/* 6. Trust strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <TrustBadge
                icon={<Truck size={12} />}
                label="Free delivery ₹499+"
              />
              <TrustBadge icon={<RotateCcw size={12} />} label="Easy returns" />
              <TrustBadge
                icon={<ShieldCheck size={12} />}
                label="Quality assured"
              />
              <TrustBadge icon={<Leaf size={12} />} label="Fresh daily" />
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 ? (
          <div className="mt-10">
            <div
              className="w-full h-px mb-6"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #C8920A 50%, transparent)",
              }}
            />
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Leaf size={11} className="text-[#6A8B3A]" />
                  <span className="text-[9px] font-bold text-[#6A8B3A] uppercase tracking-widest font-['Inter']">
                    You may also like
                  </span>
                </div>
                <h2 className="font-['Lora'] text-xl font-bold text-[#1E1008]">
                  From the{" "}
                  <span className="capitalize">
                    {relatedProducts[0]?.category}
                  </span>{" "}
                  collection
                </h2>
              </div>
              <Link
                to={`/products/${relatedProducts[0]?.category?.toLowerCase()}`}
                className="text-xs font-semibold text-[#8B3A2A] hover:underline font-['Inter'] hidden sm:block"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id || item._id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div
              className="w-full h-px mb-6"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #C8920A 50%, transparent)",
              }}
            />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EDE6D6] flex items-center justify-center">
                <SearchAlertIcon size={20} className="text-[#6A8B3A]" />
              </div>
              <p className="text-md font-semibold text-[#5A3E2B]">
                No related products found
              </p>
            </div>
            <div className="border-none bg-primary/20 border-primary rounded-lg px-3 py-2 hover:bg-primary/30 transition-colors">
              <Link
                to="/products"
                className="text-sm text-[#8B3A2A] flex items-center gap-3 font-semibold font-['Inter']"
              >
                Browse other products
                <ArrowUpRightFromSquareIcon size={20} color="#8B3A2A" />
              </Link>
            </div>
          </div>
        )}
        <div
          ref={reviewsRef}
          className="max-w-full mt-4 mx-auto px-2 md:px-4 pb-16 space-y-6"
        >
          <h2 className="text-lg font-semibold" style={{ color: "#1E1008" }}>
            Customer Reviews
          </h2>
          <ReviewForm
            targetType="product"
            targetId={product._id}
            onSubmitted={() => {
              invalidateReviewSummary("product", product._id);
              fetchReviewSummary("product", product._id);
              setReviewRefresh((r) => r + 1);
            }}
          />
          <ReviewList
            targetType="product"
            targetId={product._id}
            refreshTrigger={reviewRefresh}
            isOwner={isOwner}
          />
        </div>
      </div>

      {/* ── Mobile Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FAF5EC] border-t border-[#D8C9B4] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex gap-2.5 items-stretch">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(itemId)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B3A2A] hover:bg-[#7A2E20] active:scale-[0.98] transition-all text-[#FAF5EC] text-sm font-bold rounded-xl font-['Inter']"
            >
              <ShoppingBasket size={15} />
              Add to Basket
            </button>
          ) : (
            <div className="flex-1 flex items-center rounded-xl overflow-hidden border-2 border-[#8B3A2A] h-12">
              <button
                onClick={() => removeFromCart(itemId)}
                className="flex items-center justify-center w-12 h-full bg-[#8B3A2A] text-[#FAF5EC] cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center font-bold text-[#8B3A2A] font-['Lora']">
                {qty}
              </span>
              <button
                onClick={() => addToCart(itemId)}
                className="flex items-center justify-center w-12 h-full bg-[#8B3A2A] text-[#FAF5EC] cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
          <button
            onClick={() => {
              if (cartItems?.[itemId] === undefined) addToCart(itemId);
              navigate("/basket");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#8B3A2A] text-[#8B3A2A] text-sm font-bold rounded-xl font-['Inter'] cursor-pointer"
          >
            <Zap size={14} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
