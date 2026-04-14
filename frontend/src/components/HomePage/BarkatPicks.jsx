import { Leaf, Tag } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { useEffect } from "react";

const BarkatPicks = () => {
  const { products, fetchAllProductSummaries } = useAppContext();

  const discounted = products
    .filter((p) => p.offerPrice && p.offerPrice < p.price && p.inStock)
    .sort((a, b) => {
      const discA = (a.price - a.offerPrice) / a.price;
      const discB = (b.price - b.offerPrice) / b.price;
      return discB - discA;
    })
    .slice(0, 12);

  useEffect(() => {
    if (discounted.length) {
      fetchAllProductSummaries(discounted.map((p) => p._id));
    }
  }, [products]);

  if (!discounted.length) return null;

  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 pt-1 pb-8">
      <div className="flex items-end justify-between mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Tag size={12} className="text-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest font-['Inter']">
              Best Deals
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A] leading-tight">
            Today's Barkat Picks
          </h2>
          <p className="text-sm text-[#7A6A5A] font-['Inter'] mt-0.5">
            Handpicked deals — biggest discounts first
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-primary-alt hover:text-[#8A6010] transition-colors font-['Inter'] hidden sm:block shrink-0 mb-1"
        >
          View all →
        </Link>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {discounted.map((item) => (
          <div key={item._id} className="shrink-0 w-44 sm:w-48 md:w-52">
            <ProductCard item={item} />
          </div>
        ))}
      </div>

      <div className="mt-5 sm:hidden">
        <Link
          to="/products"
          className="block text-center text-sm font-semibold text-primary-alt border border-primary-alt rounded-xl py-2.5 hover:bg-primary-alt/10 transition-all font-['Inter']"
        >
          View all deals →
        </Link>
      </div>
    </div>
  );
};

export default BarkatPicks;