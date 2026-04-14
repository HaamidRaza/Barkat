import React from "react";
import { Leaf, Truck, Store, ShieldCheck, RotateCcw } from "lucide-react";

const strips = [
  {
    icon: <Leaf size={15} className="text-secondary" />,
    label: "Fresh Daily",
    sub: "Harvested every morning",
  },
  {
    icon: <Truck size={15} className="text-primary" />,
    label: "Fast Delivery",
    sub: "In 2–4 hours",
  },
  {
    icon: <Store size={15} className="text-[#854F0B]" />,
    label: "Local Vendors",
    sub: "From your city",
  },
  {
    icon: <ShieldCheck size={15} className="text-primary" />,
    label: "Quality Assured",
    sub: "Handpicked & checked",
  },
  {
    icon: <RotateCcw size={15} className="text-[#5A3E2B]" />,
    label: "Easy Returns",
    sub: "No questions asked",
  },
];

const TrustStrip = () => {
  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-4">
      <div className="flex items-end justify-between mb-4">
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A] leading-tight">
          Why we are your most trusted <i className="text-primary">bazaar</i>
        </h2>
      </div>
      <div
        className="flex items-center justify-between gap-2 bg-[#EDE6D6] rounded-2xl px-4 sm:px-8 py-4 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          boxShadow: "0 2px 10px rgba(90,62,43,0.07)",
        }}
      >
        {strips.map((item, i) => (
          <React.Fragment key={item.label}>
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#F6F1E7] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-[#2A1A1A] font-['Inter'] whitespace-nowrap">
                  {item.label}
                </span>
                <span className="text-[10px] text-[#7A6A5A] font-['Inter'] whitespace-nowrap hidden sm:block">
                  {item.sub}
                </span>
              </div>
            </div>
            {i < strips.length - 1 && (
              <div className="w-px h-7 bg-[#D8C9B4] shrink-0 hidden sm:block" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TrustStrip;
