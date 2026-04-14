import React from "react";
import MainBanner from "../../assets/main_banner.png";
import MainBannerSmall from "../../assets/main_banner_small.png";
import { Heart, Leaf, ShoppingBasket, ShoppingBasketIcon, ShovelIcon } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20">
      {/* Desktop */}
      <div
        className="hidden md:flex items-center justify-between gap-8 bg-background rounded-2xl overflow-hidden px-10 lg:px-16 py-20 lg:py-28"
        style={{
          background: "linear-gradient(120deg, #F6F1E7 60%, #F5E6C8 100%)",
        }}
      >
        {/* Left */}
        <div className="flex flex-col gap-6 max-w-lg z-10">
          <div className="flex items-center gap-2">
            <span className="w-5 h-px bg-primary-alt" />
            <span className="text-xs font-semibold text-primary-alt uppercase tracking-widest">
              Barkat Grocery
            </span>
          </div>

          <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-[#2A1A1A] leading-tight">
            Fresh from the Bazaar,
            <br />
            <span className="text-primary flex items-baseline gap-2">Straight to You <Heart size={30} fill="#7A2E2E"/></span>
          </h1>

          <p className="text-secondary-alt text-base leading-relaxed font-['Inter']">
            Handpicked groceries, daily essentials, and everything you
            need—delivered with care and abundance.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to={"/products"} className="flex gap-1 items-center px-6 py-3 cursor-pointer bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-background text-sm font-semibold rounded-xl shadow-sm font-['Inter']">
              <ShoppingBasketIcon size={16}/>
              <span>Shop Now</span>
            </Link>
            <Link to={"/recipes"} className="px-6 py-3 cursor-pointer border border-primary-alt text-[#8A6010] hover:bg-primary-alt/10 active:scale-95 transition-all text-sm font-semibold rounded-xl font-['Inter']">
              Explore Recipes →
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-wrap pt-1">
            {[
              { icon: <Leaf size={18} />, label: "Fresh Today" },
              { icon: <ShovelIcon size={18} />, label: "Local Sellers" },
              { icon: <ShoppingBasket size={18} />, label: "Handpicked" },
            ].map((tag) => (
              <div
                key={tag.label}
                className="flex items-center gap-1.5 text-xs text-secondary-alt font-medium bg-[#EDE4D2] px-3 py-1.5 rounded-full"
              >
                <span>{tag.icon}</span>
                {tag.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="relative shrink-0 w-105 lg:w-130 xl:w-170">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,160,23,0.12) 0%, transparent 70%)",
            }}
          />
          <img
            src={MainBanner}
            alt="Fresh groceries"
            className="w-full h-auto object-cover rounded-2xl relative z-10"
            style={{ filter: "saturate(1.08) brightness(1.03) sepia(0.06)" }}
          />
        </div>
      </div>

      {/* Mobile */}
      <div
        className="flex md:hidden flex-col rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #F6F1E7 50%, #F5E6C8 100%)",
        }}
      >
        {/* Image */}
        <div className="relative w-full">
          <img
            src={MainBannerSmall}
            alt="Fresh groceries"
            className="w-full h-52 object-cover"
            style={{ filter: "saturate(1.08) brightness(1.03) sepia(0.06)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, #F6F1E7 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 px-5 pb-6 -mt-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest">
              Barkat Grocery
            </span>
          </div>

          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#2A1A1A] leading-tight">
            Bring Home
            <br />
            <span className="text-primary">the Bazaar</span>
          </h1>

          <p className="text-secondary-alt text-sm leading-relaxed font-['Inter']">
            Handpicked groceries and daily essentials—delivered with care and
            abundance.
          </p>

          <div className="flex flex-col gap-2.5">
            <button className="w-full py-3 cursor-pointer bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-background text-sm font-semibold rounded-xl shadow-sm font-['Inter']">
              Add to Basket
            </button>
            <button className="w-full py-3 cursor-pointer border border-primary-alt text-[#8A6010] hover:bg-primary-alt/10 active:scale-95 transition-all text-sm font-semibold rounded-xl font-['Inter']">
              Explore Barkat Deals →
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: <Leaf size={18} />, label: "Fresh Today" },
              { icon: <ShovelIcon size={18} />, label: "Local Sellers" },
            ].map((tag) => (
              <div
                key={tag.label}
                className="flex items-center gap-1.5 text-xs text-secondary-alt font-medium bg-[#EDE4D2] px-3 py-1.5 rounded-full"
              >
                <span>{tag.icon}</span>
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
