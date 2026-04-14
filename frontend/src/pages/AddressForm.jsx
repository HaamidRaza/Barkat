import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  User,
  Phone,
  Home,
  Building2,
  Hash,
  Globe,
  Leaf,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import axios from "../config/api.js";
import { toast } from "react-toastify";

/* ── validators ─────────────────────────────────────────── */
const validators = {
  firstName: (v) =>
    v.trim().length < 2 ? "At least 2 characters required" : "",
  lastName: (v) =>
    v.trim().length < 2 ? "At least 2 characters required" : "",
  phone: (v) => {
    const cleaned = v.replace(/\D/g, ""); // remove non-digits
    return cleaned.length >= 10 && cleaned.length <= 13
      ? ""
      : "Enter a valid phone number";
  },
  street: (v) => (v.trim().length < 5 ? "Street address is too short" : ""),
  city: (v) => (v.trim().length < 2 ? "Enter your city" : ""),
  state: (v) => (v.trim().length < 2 ? "Enter your state" : ""),
  zipcode: (v) =>
    /^\d{4,10}$/.test(v.replace(/\s/g, "")) ? "" : "Enter a valid postal code",
  apartment: () => "",
  country: (v) => (v.trim().length < 2 ? "Enter your country" : ""),
};

const FIELD_ORDER = [
  "firstName",
  "lastName",
  "phone",
  "street",
  "apartment",
  "city",
  "state",
  "zipcode",
  "country",
];

/* ── InputField ─────────────────────────────────────────── */
const InputField = ({
  label,
  icon,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required,
  error,
  touched,
  onBlur,
  inputRef,
  nextRef,
}) => {
  const isValid = touched && !error && value;
  const hasError = touched && !!error;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const borderClass = hasError
    ? "border-red-400 ring-2 ring-red-200"
    : isValid
      ? "border-green-400/60 ring-2 ring-green-100"
      : "border-amber-200/80 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-600/10";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-amber-900/70 tracking-wide">
        {label}
        {required && <span className="text-red-700 ml-0.5">*</span>}
      </label>

      <div
        className={`flex items-center gap-2.5 h-11 px-2 md:px-3 rounded-xl border bg-amber-50/80 transition-all duration-150 ${borderClass}`}
      >
        {icon && <span className="text-amber-700/45 shrink-0">{icon}</span>}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="on"
          className="flex-1 bg-transparent text-[13.5px] text-stone-800 placeholder:text-amber-900/25 outline-none"
        />
        {isValid && (
          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
        )}
        {hasError && (
          <AlertCircle size={14} className="text-red-500 shrink-0" />
        )}
      </div>
      {hasError && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
};

/* ── InfoBox ────────────────────────────────────────────── */
const InfoBox = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-5 rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-[12px] font-semibold text-amber-800 bg-transparent border-none cursor-pointer p-0"
        aria-expanded={open}
      >
        <Info size={12} className="shrink-0" />
        <span>Why do we need this?</span>
        <ChevronRight
          size={12}
          className={`ml-auto transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <ul className="mt-3 flex flex-col gap-2 list-none p-0 m-0">
          {[
            {
              icon: <MapPin size={12} />,
              text: "To deliver your fresh groceries to the right address.",
            },
            {
              icon: <Phone size={12} />,
              text: "Our delivery partner may call you on arrival.",
            },
            {
              icon: <Leaf size={12} />,
              text: "Your data stays private and is never shared.",
            },
          ].map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[12px] text-amber-900/65 leading-relaxed"
            >
              <span className="mt-0.5 shrink-0 text-amber-700">{tip.icon}</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── SectionHead ────────────────────────────────────────── */
const SectionHead = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 mb-4 text-[10.5px] font-bold uppercase tracking-widest text-amber-800/65">
    {icon}
    {label}
  </div>
);

/* ── AddressForm ────────────────────────────────────────── */
const AddressForm = () => {
  const { navigate, user } = useAppContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [touched, setTouched] = useState({});

  const refs = {};
  FIELD_ORDER.forEach((k) => {
    refs[k] = useRef(null);
  });

  const getError = (name) => validators[name]?.(formData[name]) ?? "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name]) setTouched((p) => ({ ...p, [name]: true }));
  };

  const handleBlur = (e) =>
    setTouched((p) => ({ ...p, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(formData).map((k) => [k, true]),
    );
    setTouched(allTouched);
    const hasErrors = Object.keys(validators).some((k) => getError(k));
    if (hasErrors) return;

    try {
      const { data } = await axios.post("/address/add", { address: formData });
      if (data.success) {
        toast.success("Address saved!");
        navigate("/basket");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/basket");
    }
  }, []);

  const fp = (name, label, icon, placeholder, required = true) => ({
    label,
    icon,
    name,
    placeholder,
    required,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: getError(name),
    touched: !!touched[name],
    inputRef: refs[name],
    nextRef: (() => {
      const idx = FIELD_ORDER.indexOf(name);
      return idx >= 0 && idx < FIELD_ORDER.length - 1
        ? refs[FIELD_ORDER[idx + 1]]
        : null;
    })(),
  });

  return (
    <div className="min-h-screen bg-[#F5EDD8] flex flex-col items-center px-4 py-10 pb-28">
      <div className="w-full max-w-155">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-2 text-[10.5px] font-bold uppercase tracking-widest text-amber-700">
            <Leaf size={11} />
            Delivery
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-stone-900 leading-tight mb-1 font-serif">
            Add Delivery Address
          </h1>
          <p className="text-[13px] text-amber-900/50">
            Tell us where to bring your Basket
          </p>
        </div>

        {/* Info box */}
        <InfoBox />

        {/* Form card */}
        <div className="bg-[#EDE0C8] border border-amber-200/40 rounded-2xl p-6 sm:p-7 shadow-sm">
          <form onSubmit={handleSubmit} noValidate>
            {/* Personal Info */}
            <SectionHead icon={<User size={12} />} label="Personal Info" />
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  {...fp(
                    "firstName",
                    "First Name",
                    <User size={14} />,
                    "Ahmed",
                  )}
                />
                <InputField
                  {...fp("lastName", "Last Name", <User size={14} />, "Khan")}
                />
              </div>
              <InputField
                {...fp(
                  "phone",
                  "Phone Number",
                  <Phone size={14} />,
                  "+91 98765 43210",
                )}
                type="tel"
              />
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-linear-to-r from-transparent via-amber-300/50 to-transparent" />

            {/* Address Details */}
            <SectionHead icon={<MapPin size={12} />} label="Address Details" />
            <div className="flex flex-col gap-3">
              <InputField
                {...fp(
                  "street",
                  "Street Address",
                  <Home size={14} />,
                  "Enter your street address",
                )}
              />
              <InputField
                {...fp(
                  "apartment",
                  "Apartment / Floor",
                  <Building2 size={14} />,
                  "Flat 4B, 2nd Floor (optional)",
                )}
                required={false}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  {...fp("city", "City", <MapPin size={14} />, "Mumbai")}
                />
                <InputField
                  {...fp("state", "State", <MapPin size={14} />, "Maharashtra")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  {...fp(
                    "zipcode",
                    "Postal Code",
                    <Hash size={14} />,
                    "400001",
                  )}
                />
                <InputField
                  {...fp("country", "Country", <Globe size={14} />, "India")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/basket")}
                className="flex items-center justify-center gap-2 px-5 h-11 rounded-xl border-none border-amber-300/70 bg-transparent text-[13.5px] font-semibold text-amber-900/75 hover:bg-amber-100/60 hover:border-amber-400 active:scale-95 transition-all duration-150 sm:w-auto w-full cursor-pointer"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="submit"
                className="flex px-3 items-center justify-center gap-2 h-11 rounded-xl bg-red-800 hover:bg-red-700 active:scale-95 text-[14px] font-semibold text-amber-50 tracking-wide shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/25 transition-all duration-150 cursor-pointer"
              >
                <MapPin size={15} />
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
