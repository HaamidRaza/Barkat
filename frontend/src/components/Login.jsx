import React from "react";
import { User, Mail, Lock, Leaf, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import axios from "../config/api.js";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, loginAsAdmin, navigate } = useAppContext();
  const [state, setState] = React.useState("login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = state === "login" ? "/user/login" : "/user/register";
    const payload =
      state === "login"
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

    try {
      await toast.promise(
        axios.post(endpoint, payload),
        {
          loading: state === "login" ? "Signing in..." : "Creating account...",
          success: (response) => {
            const { data } = response;
            if (data.success) {
              if (data.isAdmin) {
                loginAsAdmin(data.user);
                setShowUserLogin(false);
                navigate("/admin");
                return "Welcome back, Admin!";
              } else {
                setUser(data.user);
                setShowUserLogin(false);
                return state === "login" ? "Welcome back!" : "Account created!";
              }
            } else {
              throw new Error(data.message || "Authentication failed");
            }
          },
          error: (err) => {
            return err.response?.data?.message || err.message || "Something went wrong";
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={() => {
        setShowUserLogin(false);
      }}
      style={{ background: "rgba(42,26,26,0.55)", backdropFilter: "blur(4px)" }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative w-full max-w-sm bg-[#F6F1E7] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(42,26,26,0.28)" }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-primary via-primary-alt to-primary" />

        {/* Close */}
        <button
          type="button"
          onClick={() => {
            setShowUserLogin(false);
          }}
          className="absolute cursor-pointer top-4 right-4 w-8 h-8 rounded-lg bg-[#EDE6D6] hover:bg-[#E4D8C4] flex items-center justify-center text-[#7A6A5A] hover:text-primary transition-all"
        >
          <X size={15} />
        </button>

        <div className="px-8 pt-8 pb-9 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-px bg-primary-alt" />
              <Leaf size={11} className="text-primary-alt" />
              <span className="w-6 h-px bg-primary-alt" />
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#2A1A1A]">
              {state === "login" ? "Welcome Back" : "Join Barkat"}
            </h1>
            <p className="text-xs text-[#7A6A5A] font-['Inter']">
              {state === "login"
                ? "Sign in to your account to continue"
                : "Create your account and start shopping"}
            </p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            {state !== "login" && (
              <div className="flex items-center gap-3 bg-[#EDE6D6] border border-[#D8C9B4] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl px-4 h-12 transition-all">
                <User size={14} className="text-[#9A8A7A] shrink-0" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  className="flex-1 bg-transparent text-sm text-[#2A1A1A] placeholder:text-[#B0A090] outline-none font-['Inter']"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-3 bg-[#EDE6D6] border border-[#D8C9B4] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl px-4 h-12 transition-all">
              <Mail size={14} className="text-[#9A8A7A] shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="flex-1 bg-transparent text-sm text-[#2A1A1A] placeholder:text-[#B0A090] outline-none font-['Inter']"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-[#EDE6D6] border border-[#D8C9B4] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl px-4 h-12 transition-all">
              <Lock size={14} className="text-[#9A8A7A] shrink-0" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="flex-1 bg-transparent text-sm text-[#2A1A1A] placeholder:text-[#B0A090] outline-none font-['Inter']"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Forgot */}
          {state === "login" && (
            <div className="-mt-2 text-right">
              <button
                type="button"
                className="text-xs cursor-pointer text-primary-alt hover:text-[#8A6010] transition-colors font-['Inter'] font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer h-12 rounded-xl bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-[#F6F1E7] text-sm font-semibold font-['Inter'] shadow-sm"
          >
            {state === "login" ? "Login" : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D8C9B4]" />
            <span className="text-[10px] text-[#B0A090] font-['Inter'] uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-[#D8C9B4]" />
          </div>

          {/* Toggle */}
          <p className="text-center text-xs text-[#7A6A5A] font-['Inter']">
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              type="button"
              onClick={() =>
                setState((p) => (p === "login" ? "register" : "login"))
              }
              className="ml-1.5 cursor-pointer text-primary font-semibold hover:text-[#9B3D3D] transition-colors"
            >
              {state === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
