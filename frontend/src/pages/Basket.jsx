import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "../config/api.js";
import { toast } from "react-toastify";
import {
  ShoppingBasket,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  MapPin,
  ChevronDown,
  Truck,
  ShieldCheck,
  Tag,
  Leaf,
} from "lucide-react";

const Basket = () => {
  const {
    user,
    products,
    cartItems,
    removeFromCart,
    clearCart,
    setCartItems,
    updateCartItem,
    getCartCount,
    getCartAmount,
    navigate,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      const arr = Object.entries(cartItems)
        .map(([id, qty]) => {
          const product = products.find(
            (p) => String(p.id) === id || String(p._id) === id,
          );
          return product ? { ...product, qty } : null;
        })
        .filter(Boolean);
      setCartArray(arr);
    }
  }, [cartItems, products]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/address/get");
        if (data.success) {
          setAddress(data.addresses);
          setSelectedAddress(data.addresses[0] || null);
        }
      } catch (e) {
        toast.error(e.message);
      }
    };
    if (user) fetchAddresses();
  }, [user]);

  const subtotal = cartArray.reduce((sum, item) => {
    const hasOffer =
      item.offerPrice != null &&
      item.offerPrice > 0 &&
      item.offerPrice < item.price;
    const price = hasOffer ? item.offerPrice : item.price;
    return sum + price * item.qty;
  }, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.02);
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    try {
      if (!selectedAddress) return toast.error("Please select an address.");

      if (paymentOption === "COD") {
        const { data } = await axios.post("/order/cod", {
          userId: user._id,
          items: cartArray.map((i) => ({ product: i._id, quantity: i.qty })),
          address: selectedAddress._id,
          amount: total,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(data.message);
        }
      }

      if (paymentOption === "Online") {
        // Step 1: create Razorpay order
        const { data } = await axios.post("/order/razorpay", { amount: total });
        if (!data.success) return toast.error(data.message);

        // Step 2: open Razorpay popup
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: "INR",
          name: "Barkat",
          description: "Order Payment",
          order_id: data.order.id,
          handler: async (response) => {
            // Step 3: verify payment
            const { data: verifyData } = await axios.post("/order/verify", {
              ...response,
              orderData: {
                userId: user._id,
                items: cartArray.map((i) => ({
                  product: i._id,
                  quantity: i.qty,
                })),
                address: selectedAddress._id,
                amount: total,
              },
            });
            if (verifyData.success) {
              toast.success(verifyData.message);
              setCartItems({});
              navigate("/orders");
            } else {
              toast.error(verifyData.message);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: "#8B3A2A" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (cartArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 text-center min-h-screen md:min-h-[87.5vh] px-6">
        <div className="w-20 h-20 rounded-full bg-[#EDE6D6] flex items-center justify-center">
          <ShoppingBasket size={32} className="text-[#B0A090]" />
        </div>
        <div>
          <p className="font-['Playfair_Display'] text-2xl font-bold text-[#2A1A1A]">
            Your basket is empty
          </p>
          <p className="text-sm text-[#7A6A5A] mt-1">
            Add some fresh picks to get started
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-primary text-[#F6F1E7] text-sm font-semibold rounded-xl active:scale-95 transition-all"
        >
          <Leaf size={14} /> Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F1E7]">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-20 bg-[#F6F1E7] border-b border-[#E2D0B8] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer w-8 h-8 rounded-lg bg-[#EDE6D6] flex items-center justify-center text-[#5A3E2B] active:scale-95 transition-all shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-primary-alt uppercase tracking-widest">
            Checkout
          </p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#2A1A1A] leading-tight">
            Your Basket
          </p>
        </div>
        <span className="shrink-0 bg-primary text-[#F6F1E7] text-[11px] font-bold px-2.5 py-1 rounded-full">
          {getCartCount()} item{getCartCount() !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Scrollable body ── */}
      <div className="px-4 pt-4 pb-40 flex flex-col gap-3 lg:hidden">
        {/* Cart Items */}
        <p className="text-[10px] font-bold text-[#9A8A7A] uppercase tracking-widest">
          Items
        </p>

        {cartArray.map((item) => {
          const hasOffer =
            typeof item?.offerPrice === "number" &&
            item.offerPrice > 0 &&
            item.offerPrice !== null &&
            item.offerPrice < item.price;
          const price = hasOffer ? item.offerPrice : item.price;
          const original = hasOffer ? item.price : null;

          return (
            <div
              key={item.id || item._id}
              className="flex items-center gap-3 bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-3"
              style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
            >
              {/* Image */}
              <div
                onClick={() => {
                  navigate(
                    `/products/${item.category.toLowerCase()}/${item._id}`,
                  );
                }}
                className="w-18 h-18 rounded-xl overflow-hidden bg-[#F6F1E7] border border-[#D8C9B4] shrink-0"
              >
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  style={{ filter: "saturate(1.05)" }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p
                  onClick={() => {
                    navigate(
                      `/products/${item.category.toLowerCase()}/${item._id}`,
                    );
                  }}
                  className="font-['Playfair_Display'] text-[13px] font-bold text-[#2A1A1A] leading-snug line-clamp-1"
                >
                  {item.name}
                </p>
                {item.subtitle && (
                  <p className="text-[11px] text-[#9A8A7A] line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-bold text-primary">
                    ₹{price}
                  </span>
                  {original && (
                    <span className="text-[11px] text-[#9A8A7A] line-through">
                      ₹{original}
                    </span>
                  )}
                </div>

                {/* Qty + Delete in same row */}
                <div className="flex items-center justify-around gap-2 mt-1.5">
                  <div className="flex items-center rounded-lg overflow-hidden border border-[#D8C9B4] h-8">
                    <button
                      onClick={() => {
                        if (item.qty === 1) clearCart(item.id || item._id);
                        else updateCartItem(item.id || item._id, item.qty - 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-[#F6F1E7] active:bg-primary active:text-[#F6F1E7] text-[#7A6A5A] transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#2A1A1A]">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItem(item.id || item._id, item.qty + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-[#F6F1E7] active:bg-primary active:text-[#F6F1E7] text-[#7A6A5A] transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <button
                    onClick={() => clearCart(item._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C0A090] active:text-red-600 active:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Free delivery nudge */}
        {shipping > 0 && (
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
            <Truck size={14} className="text-amber-600 shrink-0" />
            <p className="text-[12px] text-amber-800 leading-snug">
              Add <span className="font-bold">₹{499 - subtotal}</span> more for{" "}
              <span className="font-bold text-green-700">free delivery</span>
            </p>
          </div>
        )}

        {/* Delivery Address */}
        <p className="text-[10px] font-bold text-[#9A8A7A] uppercase tracking-widest mt-1">
          Delivery Address
        </p>
        <div
          className="bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-3.5"
          style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
        >
          {selectedAddress ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#2A1A1A]">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </p>
                <p className="text-[11px] text-[#7A6A5A] leading-relaxed mt-0.5">
                  {selectedAddress.street}, {selectedAddress.city},{" "}
                  {selectedAddress.state} {selectedAddress.zipcode}
                </p>
              </div>
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="flex items-center gap-0.5 text-[11px] font-bold text-primary-alt"
                >
                  Change{" "}
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${showAddress ? "rotate-180" : ""}`}
                  />
                </button>
                {showAddress && (
                  <div
                    className="absolute right-0 top-6 z-20 w-56 bg-[#F6F1E7] border border-[#D8C9B4] rounded-xl overflow-hidden"
                    style={{ boxShadow: "0 8px 24px rgba(90,62,43,0.14)" }}
                  >
                    {address.map((addr, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowAddress(false);
                        }}
                        className={`px-4 py-3 text-xs cursor-pointer border-b border-[#D8C9B4] last:border-0 transition-colors ${
                          selectedAddress === addr
                            ? "bg-primary/5 text-primary font-semibold"
                            : "text-[#5A3E2B] hover:bg-[#EDE6D6]"
                        }`}
                      >
                        {addr.firstName} {addr.lastName} — {addr.city}
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        setShowAddress(false);
                        navigate("/add-address");
                      }}
                      className="px-4 py-3 text-xs font-semibold text-primary-alt hover:bg-[#EDE6D6] cursor-pointer text-center"
                    >
                      + Add new address
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin size={16} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-[#2A1A1A]">
                  No address saved
                </p>
                <p className="text-[11px] text-[#9A8A7A] mt-0.5">
                  Add a delivery address to continue
                </p>
              </div>
              <button
                onClick={() => navigate("/add-address")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
                style={{ background: "#8B3A2A", color: "#FFECD0" }}
              >
                <Plus size={12} />
                Add Address
              </button>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <p className="text-[10px] font-bold text-[#9A8A7A] uppercase tracking-widest mt-1">
          Payment Method
        </p>
        <div
          className="bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-3.5 flex flex-col gap-2"
          style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
        >
          {[
            { value: "COD", label: "Cash on Delivery" },
            { value: "Online", label: "Online Payment" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${paymentOption === opt.value ? "border-primary bg-primary/5" : "border-[#D8C9B4] hover:border-primary-alt bg-[#F6F1E7]"}`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === opt.value ? "border-primary" : "border-[#D8C9B4]"}`}
              >
                {paymentOption === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${paymentOption === opt.value ? "text-primary" : "text-[#5A3E2B]"}`}
              >
                {opt.label}
              </span>
              <input
                type="radio"
                className="hidden"
                value={opt.value}
                checked={paymentOption === opt.value}
                onChange={() => setPaymentOption(opt.value)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex px-14 xl:px-20 py-8 gap-8 items-start">
        {/* left: items */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 px-4 pb-2 border-b border-[#D8C9B4]">
            <span className="text-xs font-bold text-[#9A8A7A] uppercase tracking-widest">
              Product
            </span>
            <span className="text-xs font-bold text-[#9A8A7A] uppercase tracking-widest w-24 text-center">
              Qty
            </span>
            <span className="text-xs font-bold text-[#9A8A7A] uppercase tracking-widest w-24 text-center">
              Subtotal
            </span>
          </div>
          {cartArray.map((item) => {
            const hasOffer =
              typeof item?.offerPrice === "number" &&
              item.offerPrice > 0 &&
              item.offerPrice < item.price;
            const price = hasOffer ? item.offerPrice : item.price;
            const original = hasOffer ? item.price : null;
            return (
              <div
                key={item.id || item._id}
                className="flex items-center gap-4 bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-4 hover:border-primary-alt transition-all"
                style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
              >
                <div
                  onClick={() => {
                    navigate(
                      `/products/${item.category.toLowerCase()}/${item._id}`,
                    );
                  }}
                  className="w-24 h-24 cursor-pointer rounded-xl overflow-hidden bg-[#F6F1E7] border border-[#D8C9B4] shrink-0"
                >
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <p
                    onClick={() => {
                      navigate(
                        `/products/${item.category.toLowerCase()}/${item._id}`,
                      );
                    }}
                    className="font-['Playfair_Display'] cursor-pointer hover:text-primary text-base font-bold text-[#2A1A1A] truncate"
                  >
                    {item.name}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-[#7A6A5A] truncate">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-bold text-primary">
                      ₹{price}
                    </span>
                    {original && (
                      <span className="text-xs text-[#9A8A7A] line-through">
                        ₹{original}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center rounded-xl overflow-hidden border border-[#D8C9B4] shrink-0">
                  <button
                    onClick={() => {
                      updateCartItem(item.id || item._id, item.qty - 1);
                      if (item.qty === 1) removeFromCart(item.id || item._id);
                    }}
                    className="flex items-center justify-center cursor-pointer w-8 h-8 bg-[#F6F1E7] hover:bg-primary hover:text-[#F6F1E7] text-[#7A6A5A] transition-all"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-[#2A1A1A]">
                    {item.qty}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItem(item.id || item._id, item.qty + 1)
                    }
                    className="flex items-center justify-center cursor-pointer w-8 h-8 bg-[#F6F1E7] hover:bg-primary hover:text-[#F6F1E7] text-[#7A6A5A] transition-all"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <div className="w-20 text-right shrink-0">
                  <span className="text-sm font-bold text-[#2A1A1A]">
                    ₹{price * item.qty}
                  </span>
                </div>
                <button
                  onClick={() => clearCart(item._id)}
                  className="w-8 h-8 rounded-lg hover:bg-[#FDF0EE] cursor-pointer text-[#B0A090] hover:text-red-600 transition-all shrink-0 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="cursor-pointer self-start flex items-center gap-2 text-sm font-semibold text-primary-alt hover:text-[#8A6010] transition-colors mt-2"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </button>
        </div>
        {/* right: summary — same as before */}
        <div className="w-90 shrink-0 flex flex-col gap-4">
          <div
            className="bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-4 flex flex-col gap-3"
            style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
          >
            <p className="text-[10px] font-bold text-[#9A8A7A] uppercase tracking-widest">
              Delivery Address
            </p>
            {selectedAddress ? (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin size={13} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2A1A1A]">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p className="text-xs text-[#7A6A5A] leading-relaxed mt-0.5">
                    {selectedAddress.street}, {selectedAddress.city},{" "}
                    {selectedAddress.state} {selectedAddress.zipcode}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowAddress(!showAddress)}
                    className="flex items-center cursor-pointer gap-1 text-xs font-semibold text-primary-alt"
                  >
                    Change{" "}
                    <ChevronDown
                      size={11}
                      className={`transition-transform ${showAddress ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showAddress && (
                    <div
                      className="absolute right-0 top-7 z-20 w-56 bg-[#F6F1E7] border border-[#D8C9B4] rounded-xl overflow-hidden"
                      style={{ boxShadow: "0 8px 24px rgba(90,62,43,0.14)" }}
                    >
                      {address.map((addr, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedAddress(addr);
                            setShowAddress(false);
                          }}
                          className={`px-4 py-3 text-xs cursor-pointer border-b border-[#D8C9B4] last:border-0 ${selectedAddress === addr ? "bg-primary/5 text-primary font-semibold" : "text-[#5A3E2B] hover:bg-[#EDE6D6]"}`}
                        >
                          {addr.firstName} {addr.lastName} — {addr.city}
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setShowAddress(false);
                          navigate("/add-address");
                        }}
                        className="px-4 py-3 text-xs font-semibold text-primary-alt hover:bg-[#EDE6D6] cursor-pointer text-center"
                      >
                        + Add new address
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-[#2A1A1A]">
                    No address saved
                  </p>
                  <p className="text-[11px] text-[#9A8A7A] mt-0.5">
                    Add a delivery address to continue
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error("Register/Login to continue shopping.");
                    } else {
                      navigate("/add-address");
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
                  style={{ background: "#8B3A2A", color: "#FFECD0" }}
                >
                  <Plus size={12} />
                  Add Address
                </button>
              </div>
            )}
          </div>
          <div
            className="bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-4 flex flex-col gap-3"
            style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
          >
            <p className="text-[10px] font-bold text-[#9A8A7A] uppercase tracking-widest">
              Payment Method
            </p>
            <div className="flex flex-col gap-2">
              {[
                { value: "COD", label: "Cash on Delivery" },
                { value: "Online", label: "Online Payment" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${paymentOption === opt.value ? "border-primary bg-primary/5" : "border-[#D8C9B4] hover:border-primary-alt bg-[#F6F1E7]"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === opt.value ? "border-primary" : "border-[#D8C9B4]"}`}
                  >
                    {paymentOption === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${paymentOption === opt.value ? "text-primary" : "text-[#5A3E2B]"}`}
                  >
                    {opt.label}
                  </span>
                  <input
                    type="radio"
                    className="hidden"
                    value={opt.value}
                    checked={paymentOption === opt.value}
                    onChange={() => setPaymentOption(opt.value)}
                  />
                </label>
              ))}
            </div>
          </div>
          <div
            className="bg-[#EDE6D6] border border-[#D8C9B4] rounded-2xl p-4 flex flex-col gap-3"
            style={{ boxShadow: "0 1px 6px rgba(90,62,43,0.07)" }}
          >
            <p className="text-[10px] font-bold text-[#9A8A7A] uppercase tracking-widest">
              Order Summary
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-[#5A3E2B]">
                <span>Subtotal ({getCartCount()} items)</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#5A3E2B]">
                <span className="flex items-center gap-1.5">
                  <Truck size={12} className="text-secondary" /> Delivery
                </span>
                <span
                  className={`font-semibold ${shipping === 0 ? "text-[#3F7D3A]" : ""}`}
                >
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-[#5A3E2B]">
                <span className="flex items-center gap-1.5">
                  <Tag size={12} className="text-primary-alt" /> Tax (2%)
                </span>
                <span className="font-semibold">₹{tax}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-[#9A8A7A] bg-[#F6F1E7] border border-[#D8C9B4] rounded-lg px-3 py-2">
                  Add ₹{499 - subtotal} more for{" "}
                  <span className="text-[#3F7D3A] font-semibold">
                    free delivery
                  </span>
                </p>
              )}
              <div className="h-px bg-[#D8C9B4] my-1" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[#2A1A1A] text-base">
                  Total
                </span>
                <span className="font-['Playfair_Display'] text-2xl font-bold text-primary">
                  ₹{total}
                </span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              className="w-full cursor-pointer flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-[#F6F1E7] text-sm font-semibold rounded-xl shadow-sm mt-1"
            >
              <ShoppingBasket size={15} />{" "}
              {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
            </button>
            <div className="flex items-center justify-center gap-4 pt-1">
              {[
                { icon: <ShieldCheck size={12} />, label: "Secure" },
                { icon: <Truck size={12} />, label: "Fast delivery" },
                { icon: <Leaf size={12} />, label: "Fresh" },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-1 text-[11px] text-[#9A8A7A]"
                >
                  <span className="text-secondary">{t.icon}</span>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom order bar (mobile only) ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF6EE] border-t border-[#E2D0B8] px-4 pb-5"
        style={{ boxShadow: "0 -4px 20px rgba(90,52,26,0.10)" }}
      >
        {/* Summary row */}
        <div className="flex flex-col items-center justify-between mb-2.5">
          <div className="w-full my-2">
            <span className="flex justify-around text-[10px] text-[#9A8A7A] uppercase tracking-wide font-semibold">
              <span>{getCartCount()} items</span>
              <span
                className={`text-md font-bold ${shipping === 0 ? "text-[#3F7D3A]" : "text-[#5A3E2B]"}`}
              >
                {shipping === 0 ? "Free delivery" : `+₹${shipping} delivery`}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col">
              <span className="font-['Playfair_Display'] text-xl font-extrabold text-primary">
                ₹{total}
              </span>
              {tax > 0 && (
                <span className="text-[10px] text-[#9A8A7A]">
                  incl. ₹{tax} tax
                </span>
              )}
            </div>
            <button
              onClick={placeOrder}
              className="flex items-center gap-2 px-2 py-4 bg-primary active:bg-[#8E2020] active:scale-95 transition-all text-[#F6F1E7] text-sm font-bold rounded-xl"
              style={{ boxShadow: "0 3px 12px rgba(183,50,40,0.30)" }}
            >
              <ShoppingBasket size={14} />
              {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
            </button>
          </div>
        </div>

        {/* Trust pills */}
        <div className="flex items-center justify-center gap-4">
          {[
            { icon: <ShieldCheck size={10} />, label: "Secure" },
            { icon: <Truck size={10} />, label: "Fast delivery" },
            { icon: <Leaf size={10} />, label: "Farm fresh" },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-1 text-[10px] text-[#9A8A7A]"
            >
              <span className="text-green-600">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Basket;
