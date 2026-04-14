import React from "react";
import {
  MapPin,
  Star,
  Leaf,
  ShoppingBasket,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

const sellers = [
  {
    id: 1,
    name: "Ramesh Vegetable Farm",
    location: "Nashik, Maharashtra",
    tagline: "Fresh vegetables, straight from the fields",
    description:
      "Three generations of farming. Every morning, Ramesh harvests and dispatches to your door before noon.",
    rating: 4.9,
    reviews: 342,
    since: "2019",
    badge: "Top Seller",
    tag: "Fresh Today",
    tagColor: "bg-[#EAF3DE] text-[#3F7D3A]",
    accent: "#3F7D3A",
    accentBg: "#EAF3DE",
    products: [
      {
        name: "Tomatoes",
        price: "₹42/kg",
        image:
          "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&q=80",
      },
      {
        name: "Spinach",
        price: "₹28/bunch",
        image:
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&q=80",
      },
      {
        name: "Capsicum",
        price: "₹60/kg",
        image:
          "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&q=80",
      },
    ],
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
  },
  {
    id: 2,
    name: "Fatima's Spice House",
    location: "Old City, Hyderabad",
    tagline: "Authentic masalas, ground fresh weekly",
    description:
      "Fatima sources whole spices directly from Kerala and Rajasthan, grinding small batches to preserve every note of flavour.",
    rating: 4.8,
    reviews: 218,
    since: "2021",
    badge: "Artisan Pick",
    tag: "Handpicked",
    tagColor: "bg-[#FAEEDA] text-[#854F0B]",
    accent: "#854F0B",
    accentBg: "#FAEEDA",
    products: [
      {
        name: "Biryani Masala",
        price: "₹95/100g",
        image:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80",
      },
      {
        name: "Kashmiri Mirch",
        price: "₹75/100g",
        image:
          "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=200&q=80",
      },
      {
        name: "Garam Masala",
        price: "₹85/100g",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80",
      },
    ],
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80",
  },
];

const SellerHighlight = () => {
  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Leaf size={12} className="text-primary-alt" />
            <span className="text-[10px] font-semibold text-primary-alt uppercase tracking-widest font-['Inter']">
              From Local Sellers
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A] leading-tight">
            Meet Your Provider
          </h2>
          <p className="text-sm text-[#7A6A5A] font-['Inter'] mt-0.5">
            Real people, real produce — know who grows your food
          </p>
        </div>

        <a
          href="/vendors"
          className="text-sm font-semibold text-primary-alt hover:text-[#8A6010] transition-colors font-['Inter'] hidden sm:block shrink-0 mb-1"
        >
          All vendors →
        </a>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-5">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="group bg-[#EDE6D6] rounded-2xl overflow-hidden border border-transparent hover:border-primary-alt transition-all duration-300"
            style={{
              boxShadow: "0 2px 12px rgba(90,62,43,0.08)",
              transition: "box-shadow 0.25s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(90,62,43,0.13)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 2px 12px rgba(90,62,43,0.08)")
            }
          >
            {/* Cover */}
            <div className="relative h-32 sm:h-40 overflow-hidden">
              <img
                src={seller.cover}
                alt={seller.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  filter: "saturate(1.05) brightness(0.88) sepia(0.08)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(42,26,26,0.1) 0%, rgba(42,26,26,0.55) 100%)",
                }}
              />

              {/* Badge */}
              <span
                className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full font-['Inter'] ${seller.tagColor}`}
              >
                {seller.tag}
              </span>

              {/* Since */}
              <span className="absolute top-3 right-3 text-[10px] font-semibold text-[#F6F1E7]/80 font-['Inter']">
                Selling since {seller.since}
              </span>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* Seller info row */}
              <div className="flex items-start gap-3 sm:gap-4 -mt-10 sm:-mt-12 relative z-10 mb-4">
                <div className="flex flex-col gap-0.5 pt-8 sm:pt-10">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-[#2A1A1A] leading-tight">
                      {seller.name}
                    </h3>
                    <BadgeCheck size={15} className="text-primary shrink-0" />
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full font-['Inter']"
                      style={{
                        background: seller.accentBg,
                        color: seller.accent,
                      }}
                    >
                      {seller.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#7A6A5A]">
                    <MapPin size={11} />
                    <span className="text-xs font-['Inter']">
                      {seller.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tagline + description */}
              <p className="font-['Playfair_Display'] text-sm sm:text-base italic text-[#5A3E2B] mb-1">
                "{seller.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-[#7A6A5A] font-['Inter'] leading-relaxed mb-4">
                {seller.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-[#D8C9B4] mb-4" />

              {/* Rating + products row */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={
                          i < Math.round(seller.rating)
                            ? "#D4A017"
                            : "transparent"
                        }
                        className={
                          i < Math.round(seller.rating)
                            ? "text-primary-alt"
                            : "text-[#D8C9B4]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#5A3E2B] font-['Inter']">
                    {seller.rating}
                  </span>
                  <span className="text-xs text-[#9A8A7A] font-['Inter']">
                    ({seller.reviews} reviews)
                  </span>
                </div>

                {/* Mini products */}
                <div className="flex items-center gap-2">
                  {seller.products.map((p) => (
                    <div
                      key={p.name}
                      className="flex flex-col items-center gap-1 group/item cursor-pointer"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#F6F1E7] border border-[#D8C9B4] group-hover/item:border-primary-alt transition-colors">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          style={{ filter: "saturate(1.05) sepia(0.04)" }}
                        />
                      </div>
                      <span className="text-[9px] text-[#7A6A5A] font-['Inter'] text-center leading-tight hidden sm:block">
                        {p.name}
                      </span>
                    </div>
                  ))}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F6F1E7] border border-dashed border-[#D8C9B4] flex items-center justify-center cursor-pointer hover:border-primary-alt transition-colors">
                    <ChevronRight size={14} className="text-[#9A8A7A]" />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-2.5 mt-4">
                <button className="flex-1 flex items-center justify-center py-1 bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-[#F6F1E7] text-sm font-semibold rounded-xl font-['Inter']">
                  {/* <ShoppingBasket size={24} /> */}
                  Shop from {seller.name.split(" ")[0]}
                </button>

                <a
                  href={`/vendors/${seller.id}`}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-primary-alt text-[#8A6010] hover:bg-primary-alt/10 active:scale-95 transition-all text-sm font-semibold rounded-xl font-['Inter']"
                >
                  View Stall
                  <ChevronRight size={13} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile all vendors */}
      <div className="mt-5 sm:hidden">
        <a
          href="/vendors"
          className="block text-center text-sm font-semibold text-primary-alt border border-primary-alt rounded-xl py-2.5 hover:bg-primary-alt/10 transition-all font-['Inter']"
        >
          Meet all vendors →
        </a>
      </div>
    </div>
  );
};

export default SellerHighlight;
