import React, { useState } from "react";
import { Mail, Send, Leaf } from "lucide-react";

const FooterCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section>
      <div className="mb-18 px-4 md:px-6 lg:px-14 xl:px-20 py-14 md:py-4 flex flex-col items-center text-center gap-2">
        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <span className="w-5 h-px bg-primary-alt" />
          <Leaf size={11} className="text-primary-alt" />
          <span className="text-[10px] font-bold text-primary-alt uppercase tracking-widest font-['Inter']">
            Stay Connected
          </span>
          <Leaf size={11} className="text-primary-alt" />
          <span className="w-5 h-px bg-primary-alt" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2A1A1A] leading-tight">
            Never Miss a <span className="text-primary italic">Deal</span>
          </h2>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="flex items-center gap-3 bg-[#EAF3DE] border border-[#3F7D3A]/25 rounded-2xl px-6 py-4 mt-2">
            <div className="w-8 h-8 rounded-full bg-[#3F7D3A]/15 flex items-center justify-center shrink-0">
              <Leaf size={14} className="text-[#3F7D3A]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#2A1A1A] font-['Inter']">
                You're in the bazaar!
              </p>
              <p className="text-xs text-[#5A3E2B] font-['Inter']">
                We'll send you the freshest updates soon.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2.5 w-full max-w-lg mt-2"
          >
            <div className="flex items-center gap-2.5 flex-1 bg-[#F6F1E7] border border-[#D8C9B4] hover:border-primary-alt focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all rounded-xl px-4 py-0.5">
              <Mail size={14} className="text-[#9A8A7A] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-transparent outline-none text-sm text-[#2A1A1A] placeholder:text-[#B0A090] py-3 font-['Inter']"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-3 bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-[#F6F1E7] text-sm font-semibold rounded-xl font-['Inter'] shrink-0 shadow-sm"
            >
              <Send size={13} />
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#9A8A7A] font-['Inter'] mt-1">
          By subscribing you agree to our privacy policy. Unsubscribe anytime.
        </p>
        <p className="text-sm md:text-base text-[#7A6A5A] font-['Inter'] max-w-md leading-relaxed">
          Fresh deals, seasonal picks, and bazaar stories — delivered to your
          inbox. No spam, ever.
        </p>
      </div>
    </section>
  );
};

export default FooterCTA;
