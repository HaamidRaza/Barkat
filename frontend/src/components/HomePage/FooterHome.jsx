import React from "react";
import { Store, ChefHat, ArrowRight, Leaf, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import stall from "../../assets/stall.png";
const PERKS = [
  {
    icon: <ShoppingBag size={16} />,
    title: "Reach more buyers",
    desc: "List your products in front of thousands of daily shoppers.",
  },
  {
    icon: <ChefHat size={16} />,
    title: "Share your recipes",
    desc: "Publish community recipes and link them to your products.",
  },
  {
    icon: <Leaf size={16} />,
    title: "Grow your brand",
    desc: "Build a trusted seller profile with ratings and reviews.",
  },
];

const FooterCTA = () => {
  const { user, isSeller, setShowUserLogin, navigate } = useAppContext();

  const handleCTA = () => {
    if (!user) {
      setShowUserLogin(true);
    } else if (isSeller) {
      navigate("/seller");
    } else {
      navigate("/seller/register");
    }
  };

  return (
    <section className="px-4 md:px-6 lg:px-14 xl:px-20 py-14">
      <div
        className="rounded-3xl px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-10"
        style={{ background: "#F5EDD8" }}
      >
        {/* Left */}
        <div className="flex-1 flex flex-col gap-5 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="w-5 h-px" style={{ background: "#C8920A" }} />
            <Store size={11} style={{ color: "#C8920A" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#C8920A" }}
            >
              Sell on Barkat
            </span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-bold leading-tight text-[#1E1008]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Turn your passion
            <br />
            <span style={{ color: "#8B3A2A" }}>into a business</span>
          </h2>

          <p
            className="text-sm leading-relaxed max-w-md"
            style={{ color: "#6B5140" }}
          >
            Join our growing community of local sellers. List your products,
            share your recipes, and reach thousands of customers — all in one
            place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button
              onClick={handleCTA}
              className="flex items-center justify-center cursor-pointer gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: "#8B3A2A", color: "#FFECD0" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#7A2E20")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#8B3A2A")
              }
            >
              <Store size={15} />
              {!user
                ? "Start selling — it's free"
                : isSeller
                  ? "Go to dashboard"
                  : "Apply to become a seller"}
              <ArrowRight size={14} />
            </button>

            {!isSeller && (
              <Link
                to="/recipes"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  border: "1.5px solid #C8920A",
                  color: "#8A6010",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#C8920A18")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <ChefHat size={14} /> Browse recipes
              </Link>
            )}
          </div>

          <p className="text-xs" style={{ color: "#9A8060" }}>
            Free to join · Admin reviewed · No hidden fees
          </p>
        </div>

        {/* Center Illustration */}
        <div className="hidden md:flex items-end justify-center shrink-0 w-120 self-end">
          <img
            src={stall}
            alt="Local seller at a market stall"
            className="w-full object-contain"
          />
        </div>

        {/* Right — perks */}
        <div className="hidden md:flex flex-col gap-3 w-full md:w-72 shrink-0">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "#8B3A2A18", color: "#8B3A2A" }}
              >
                {perk.icon}
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1E1008" }}
                >
                  {perk.title}
                </p>
                <p
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: "#9A8060" }}
                >
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
