import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "../../config/api.js"
import { toast } from "react-toastify";
import {
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
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

const InputField = ({
    label,
    icon,
    type = "text",
    placeholder,
    value,
    onChange,
    required = true,
    extra,
  }) => (
    <div>
      <label
        className="block text-[11px] font-semibold text-[#9A8060] uppercase tracking-[0.08em] mb-1.5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      <div className="input-wrap relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#B8A48A]">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={extra}
        />
      </div>
    </div>
  );


const SellerRegister = () => {
  const { navigate } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  console.log("RENDER");
  

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: regData } = await axios.post(
        "/user/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        { withCredentials: true },
      );

      if (!regData.success) {
        toast.error(regData.message);
        return;
      }

      const { data: sellerData } = await axios.post(
        "/user/become-seller",
        {
          shopName: form.shopName,
          phone: form.phone,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        },
        { withCredentials: true },
      );

      if (sellerData.success) {
        toast.success("Application submitted! Await admin approval.");
        navigate("/seller/login");
      } else {
        toast.error(sellerData.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      icon: <Package size={16} />,
      label: "Curated Products",
      value: "Fresh & Daily",
    },
    {
      icon: <TrendingUp size={16} />,
      label: "Smart Shopping",
      value: "Recipe → Cart",
    },
    {
      icon: <Users size={16} />,
      label: "Local Sellers",
      value: "Bazaar Style",
    },
  ];

  const features = [
    {
      icon: <ShieldCheck size={18} />,
      title: "Secure Payouts",
      desc: "End-to-end encrypted transactions with weekly settlements",
    },
    {
      icon: <Star size={18} />,
      title: "Top Seller Rewards",
      desc: "Unlock exclusive perks as your sales grow",
    },
    {
      icon: <Truck size={18} />,
      title: "Logistics Support",
      desc: "Pan-India delivery network at discounted rates",
    },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: "#FAF5EC",
      }}
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

        .section-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 6px 0px 6px
        }
        .section-divider span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #9A8060;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .section-divider::before,
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E0D2B4;
        }
      `}</style>

      {/* ── Left Panel ── */}
      <div className="panel-left hidden lg:flex flex-col justify-around w-[46%] xl:w-[42%] p-10 xl:p-14">
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
              Start selling today
              <br />
              <span style={{ color: "#F5C9A8" }}>join our community.</span>
            </h1>
            <p
              className="text-[14px] mt-3 leading-[1.6]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,236,208,0.65)",
              }}
            >
              Create your seller account and start reaching customers who value
              fresh, local, and trusted goods.
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
                <div
                  className="flex justify-center mb-1"
                  style={{ color: "#F5C9A8" }}
                >
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
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,236,208,0.55)",
                  }}
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
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#FFECD0",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    className="text-[12px] mt-0.5 m-0 leading-normal"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(255,236,208,0.6)",
                    }}
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
          className="relative z-10 text-[12px]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,236,208,0.4)",
          }}
        >
          © 2025 SellerHub · All rights reserved
        </p>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-2 md:px-6 py-8 lg:px-10 xl:px-12 overflow-y-auto">
        <div className="w-full fade-up">
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
            style={{
              background:
                "linear-gradient(90deg, transparent, #C8920A 50%, transparent)",
            }}
          />

          {/* Heading */}
          <div className="md:flex items-center justify-between mb-8 fade-up fade-up-d1">
            <div>
              <h2
                className="text-[26px] font-bold tracking-[-0.4px] m-0 text-[#1E1008]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Create an account
              </h2>
              <p
                className="text-[14px] text-[#9A8060] mb-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Fill in your details to apply as a seller
              </p>
            </div>
            <div className="hidden md:block">
              {/* Login link */}
              <span
                className="fade-up fade-up-d3 text-[13px] text-[#9A8060] text-center"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Already have an account?{" "}
                <div
                  onClick={() => navigate("/seller/login")}
                  className="w-full flex items-center justify-center gap-2 rounded-[10px] py-1  font-semibold text-white border-none cursor-pointer tracking-[0.01em] transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:scale-[0.98] disabled:opacity-65 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #A8442F 0%, #8B3A2A 100%)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <LogIn size={20} color="#F5C9A8" />
                  <button
                    type="button"
                    className="bg-transparent border-none text-background font-semibold cursor-pointer p-0 text-[13px]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Sign in
                  </button>
                </div>
              </span>
            </div>
          </div>

          {/* Form card */}
          <div
            className="fade-up fade-up-d2 rounded-[18px] px-2 md:px-5 pt-7 pb-6"
            style={{
              background: "#FEFAF2",
              border: "1.5px solid #E0D2B4",
              boxShadow: "0 4px 24px rgba(30,16,8,0.07)",
            }}
          >
            <form onSubmit={onSubmit}>
              {/* ── Account Details ── */}
              <div className="section-divider">
                <span>Account Details</span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <InputField
                  label="Full Name"
                  icon={<User size={15} strokeWidth={1.8} />}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={set("name")}
                />

                {/* Email */}
                <InputField
                  label="Email Address"
                  icon={<Mail size={15} strokeWidth={1.8} />}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                />

                {/* Password */}
                <div>
                  <label
                    className="block text-[11px] font-semibold text-[#9A8060] uppercase tracking-[0.08em] mb-1.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Password
                  </label>
                  <div className="input-wrap relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#B8A48A]">
                      <Lock size={15} strokeWidth={1.8} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={set("password")}
                      required
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#9A8060] flex items-center transition-colors duration-150"
                    >
                      {showPassword ? (
                        <EyeOff size={15} strokeWidth={1.8} />
                      ) : (
                        <Eye size={15} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Shop Details ── */}
              <div className="section-divider">
                <span>Shop Details</span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Shop Name */}
                <InputField
                  label="Shop Name"
                  icon={<Store size={15} strokeWidth={1.8} />}
                  placeholder="Your shop name"
                  value={form.shopName}
                  onChange={set("shopName")}
                />

                {/* Phone */}
                <InputField
                  label="Phone Number"
                  icon={<Phone size={15} strokeWidth={1.8} />}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>

              {/* ── Address ── */}
              <div className="section-divider">
                <span>Shop Address</span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Street */}
                <InputField
                  label="Street"
                  icon={<MapPin size={15} strokeWidth={1.8} />}
                  placeholder="Street / locality"
                  value={form.street}
                  onChange={set("street")}
                />

                {/* City + State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-[11px] font-semibold text-[#9A8060] uppercase tracking-[0.08em] mb-1.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      City
                    </label>
                    <div className="input-wrap relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#B8A48A]">
                        <MapPin size={15} strokeWidth={1.8} />
                      </div>
                      <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={set("city")}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-[11px] font-semibold text-[#9A8060] uppercase tracking-[0.08em] mb-1.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      State
                    </label>
                    <div className="input-wrap relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#B8A48A]">
                        <MapPin size={15} strokeWidth={1.8} />
                      </div>
                      <input
                        type="text"
                        placeholder="State"
                        value={form.state}
                        onChange={set("state")}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pincode */}
                <InputField
                  label="Pincode"
                  icon={<MapPin size={15} strokeWidth={1.8} />}
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={set("pincode")}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-7 w-full flex items-center justify-center gap-2 rounded-[10px] py-[13px] text-[15px] font-semibold text-white border-none cursor-pointer tracking-[0.01em] transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:scale-[0.98] disabled:opacity-65 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #A8442F 0%, #8B3A2A 100%)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" /> Submitting application...
                  </>
                ) : (
                  <>
                    Create Seller Account{" "}
                    <ArrowRight size={16} strokeWidth={2} />
                  </>
                )}
              </button>
              <p
                className="fade-up fade-up-d3 text-[13px] text-[#9A8060] text-center mt-5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/seller/login")}
                  type="button"
                  className="bg-transparent border-none text-primary font-semibold cursor-pointer p-0 text-[13px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>

          {/* Trust note */}
          <p
            className="fade-up fade-up-d4 flex items-center justify-center gap-1 text-center text-[11px] text-[#C4AD8A] mt-2 mb-8"
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

export default SellerRegister;
