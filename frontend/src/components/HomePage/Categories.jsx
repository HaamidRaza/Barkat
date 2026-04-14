import { Link, useNavigate } from "react-router-dom";
import { categories } from "../../assets/assets.js";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest font-['Inter']">
              Browse
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A]">
            Shop by Category
          </h2>
        </div>
        <Link
          to={"/products"}
          className="text-sm font-semibold text-primary-alt hover:text-[#8A6010] transition-colors font-['Inter'] hidden sm:block shrink-0"
        >
          View all →
        </Link>
      </div>

      {/* Scroll track */}
      <div
        className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => {
              navigate(`/products/${encodeURIComponent(cat.name)}`);
              scrollTo(0, 0);
            }}
            className="group flex flex-col shrink-0 w-40 sm:w-44 md:w-48 bg-background-alt rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-primary-alt transition-all duration-300"
            style={{
              boxShadow: "0 2px 8px rgba(90,62,43,0.08)",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(90,62,43,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(90,62,43,0.08)";
            }}
          >
            {/* Image */}
            <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-background">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{
                  filter: "saturate(1.05) brightness(1.02) sepia(0.04)",
                }}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-0.5 px-3 py-3">
              <p className="text-sm font-bold text-[#2A1A1A] leading-snug font-['Playfair_Display']">
                {cat.name}
              </p>
              {cat.subtitle && (
                <p className="text-xs text-[#7A6A5A] font-['Inter']">
                  {cat.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-2 sm:hidden">
        <Link
          to={"/categories"}
          className="block text-center text-sm font-semibold text-primary-alt border border-primary-alt rounded-xl py-2.5 hover:bg-primary-alt/10 transition-all font-['Inter']"
        >
          View all categories →
        </Link>
      </div>
    </div>
  );
};

export default Categories;
