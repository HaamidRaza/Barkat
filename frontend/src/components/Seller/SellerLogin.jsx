import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Eye,
  EyeOff,
  Store,
  Mail,
  Lock,
  ShieldCheck,
  Star,
  Truck,
  ArrowRight,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import axios from "../../config/api.js"
import { toast } from "react-toastify";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/seller/login",
        { email, password },
        { withCredentials: true },
      );
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSeller) return null;

  const stats = [
    { icon: <Package size={16} />, label: "Curated Products", value: "Fresh & Daily" },
    { icon: <TrendingUp size={16} />, label: "Smart Shopping", value: "Recipe → Cart" },
    { icon: <Users size={16} />, label: "Local Sellers", value: "Bazaar Style" },
  ];

  const features = [
    { icon: <ShieldCheck size={18} />, title: "Secure Payouts", desc: "End-to-end encrypted transactions with weekly settlements" },
    { icon: <Star size={18} />, title: "Top Seller Rewards", desc: "Unlock exclusive perks as your sales grow" },
    { icon: <Truck size={18} />, title: "Logistics Support", desc: "Pan-India delivery network at discounted rates" },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#FAF5EC" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-d1 { animation-delay: 0.08s; }
        .fade-up-d2 { animation-delay: 0.15s; }
        .fade-up-d3 { animation-delay: 0.22s; }
        .fade-up-d4 { animation-delay: 0.28s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .input-wrap input {
          background: #FEFAF2;
          border: 1.5px solid #D9C9A8;
          border-radius: 10px;
          padding: 11px 14px 11px 42px;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1E1008;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-wrap input::placeholder { color: #B8A48A; }
        .input-wrap input:focus {
          border-color: #8B3A2A;
          box-shadow: 0 0 0 3px rgba(139,58,42,0.1);
        }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .panel-left {
          background: linear-gradient(160deg, #8B3A2A 0%, #6B2D1F 55%, #4A1F15 100%);
          position: relative;
          overflow: hidden;
        }
        .panel-left::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(200,146,10,0.22) 0%, transparent 70%);
          top: -80px; right: -80px;
          border-radius: 50%;
          pointer-events: none;
        }
        .panel-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(168,68,47,0.3) 0%, transparent 70%);
          bottom: -40px; left: -60px;
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      {/* ── Left Panel ── */}
      <div className="panel-left hidden lg:flex flex-col justify-between w-[46%] xl:w-[42%] p-10 xl:p-14">
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white/15 border border-white/20">
              <Store size={20} color="#FFECD0" strokeWidth={1.8} />
            </div>
            <span
              className="text-[18px] font-semibold tracking-[-0.3px]"
              style={{ fontFamily: "'Lora', serif", color: "#FFECD0" }}
            >
              SellerHub
            </span>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.12em] mb-2.5"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#F5C9A8" }}
            >
              Seller Portal
            </p>
            <h1
              className="leading-[1.2] tracking-[-0.5px] m-0"
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "clamp(28px, 3vw, 38px)",
                fontWeight: 700,
                color: "#FFECD0",
              }}
            >
              Grow your business
              <br />
              <span style={{ color: "#F5C9A8" }}>with confidence.</span>
            </h1>
            <p
              className="text-[14px] mt-3 leading-[1.6]"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,236,208,0.65)" }}
            >
              Start selling your products and reach customers who value fresh,
              local, and trusted goods.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex-1 text-center rounded-[10px] px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <div className="flex justify-center mb-1" style={{ color: "#F5C9A8" }}>
                  {s.icon}
                </div>
                <p
                  className="text-[17px] font-bold m-0"
                  style={{ fontFamily: "'Lora', serif", color: "#FFECD0" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[11px] mt-0.5 m-0"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,236,208,0.55)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-[12px] px-4 py-3.5"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <div className="shrink-0 mt-0.5" style={{ color: "#F5C9A8" }}>
                  {f.icon}
                </div>
                <div>
                  <p
                    className="text-[13px] font-semibold m-0"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#FFECD0" }}
                  >
                    {f.title}
                  </p>
                  <p
                    className="text-[12px] mt-0.5 m-0 leading-[1.5]"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,236,208,0.6)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p
          className="relative z-10 text-[12px] m-0"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,236,208,0.4)" }}
        >
          © 2025 SellerHub · All rights reserved
        </p>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex justify-center items-center px-4 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-md fade-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <div className="w-9 h-9 flex items-center justify-center rounded-[9px] bg-[#8B3A2A]">
              <Store size={18} color="#FFECD0" strokeWidth={1.8} />
            </div>
            <span
              className="text-[17px] font-semibold text-[#1E1008]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              SellerHub
            </span>
          </div>
          <div
            className="w-full lg:hidden h-px mb-2"
            style={{ background: "linear-gradient(90deg, transparent, #C8920A 50%, transparent)" }}
          />

          {/* Heading */}
          <div className="mb-8 fade-up fade-up-d1">
            <h2
              className="text-[26px] font-bold tracking-[-0.4px] m-0 text-[#1E1008]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Welcome back
            </h2>
            <p
              className="text-[14px] text-[#9A8060] mt-1.5 mb-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign in to your seller account to continue
            </p>
          </div>

          {/* Form card */}
          <div
            className="fade-up fade-up-d2 rounded-[18px] px-7 pt-7 pb-6"
            style={{
              background: "#FEFAF2",
              border: "1.5px solid #E0D2B4",
              boxShadow: "0 4px 24px rgba(30,16,8,0.07)",
            }}
          >
            <form onSubmit={onSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label
                  className="block text-[11px] font-semibold text-[#9A8060] uppercase tracking-[0.08em] mb-1.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Email Address
                </label>
                <div className="input-wrap relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#B8A48A]">
                    <Mail size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="block text-[11px] font-semibold text-[#9A8060] uppercase tracking-[0.08em]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="bg-transparent border-none text-[12px] text-[#8B3A2A] cursor-pointer p-0 font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-wrap relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#B8A48A]">
                    <Lock size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#9A8060] flex items-center transition-colors duration-150"
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-[10px] py-[13px] text-[15px] font-semibold text-white border-none cursor-pointer tracking-[0.01em] transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:scale-[0.98] disabled:opacity-65 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #A8442F 0%, #8B3A2A 100%)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Register link */}
          <p
            className="fade-up fade-up-d3 text-[13px] text-[#9A8060] text-center mt-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            New seller?{" "}
            <button
              type="button"
              onClick={() => navigate("/seller/register")}
              className="bg-transparent border-none text-[#8B3A2A] font-semibold cursor-pointer p-0 text-[13px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Create an account
            </button>
          </p>

          {/* Trust note */}
          <p
            className="fade-up fade-up-d4 flex items-center justify-center gap-1 text-center text-[11px] text-[#C4AD8A] mt-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ShieldCheck size={12} strokeWidth={2} />
            Protected by Barkat's secure platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;