import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  Leaf,
  Package,
  ChevronRight,
  ChevronUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBasket,
  MapPin,
  RotateCcw,
  CreditCard,
  Banknote,
  CircleDot,
  ChevronDown,
} from "lucide-react";
import axios from "../config/api.js";
import OrderDetail from "../components/OrderDetail.jsx";

const statusConfig = {
  "Order Placed": {
    label: "Order Placed",
    icon: <CircleDot size={12} />,
    classes: "bg-[#FAEEDA] text-[#854F0B]",
    dot: "bg-[#D4A017]",
  },
  Processing: {
    label: "Processing",
    icon: <Clock size={12} />,
    classes: "bg-[#FAEEDA] text-[#854F0B]",
    dot: "bg-[#D4A017]",
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    icon: <Truck size={12} />,
    classes: "bg-[#EAF3DE] text-[#3F7D3A]",
    dot: "bg-[#3F7D3A]",
  },
  Delivered: {
    label: "Delivered",
    icon: <CheckCircle2 size={12} />,
    classes: "bg-[#EAF3DE] text-[#3F7D3A]",
    dot: "bg-[#3F7D3A]",
  },
  Cancelled: {
    label: "Cancelled",
    icon: <XCircle size={12} />,
    classes: "bg-[#FCEAEA] text-[#9B3030]",
    dot: "bg-[#9B3030]",
  },
};

const filters = [
  "All",
  "Order Placed",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const MyOrders = () => {
  const { navigate, user } = useAppContext();
  const [myOrders, setMyOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/order/user");
      if (data.success) setMyOrders(data.orders);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  const filtered =
    activeFilter === "All"
      ? myOrders
      : myOrders.filter((o) => o.status === activeFilter);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="px-4 md:px-6 lg:px-14 xl:px-20 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-7">
        <div className="flex items-center gap-2">
          <Leaf size={12} className="text-primary-alt" />
          <span className="text-[10px] font-bold text-primary-alt uppercase tracking-widest font-['Inter']">
            Account
          </span>
        </div>
        <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#2A1A1A]">
          My Orders
        </h1>
        <p className="text-sm text-[#7A6A5A] font-['Inter']">
          {myOrders.length} order{myOrders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 mb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold font-['Inter'] capitalize transition-all border ${
              activeFilter === f
                ? "bg-primary text-[#F6F1E7] border-primary shadow-sm"
                : "bg-[#EDE6D6] text-[#7A6A5A] border-[#D8C9B4] hover:border-primary-alt hover:text-[#5A3E2B]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDE6D6] flex items-center justify-center">
            <Package size={24} className="text-[#B0A090]" />
          </div>
          <div>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#2A1A1A]">
              No orders here
            </p>
            <p className="text-sm text-[#7A6A5A] font-['Inter'] mt-1">
              {activeFilter === "All"
                ? "You haven't placed any orders yet"
                : `No "${activeFilter}" orders`}
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-[#F6F1E7] text-sm font-semibold rounded-xl font-['Inter']"
          >
            <ShoppingBasket size={14} /> Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const status =
              statusConfig[order.status] ?? statusConfig["Order Placed"];
            const isOpen = expandedId === order._id;

            return (
              <div
                key={order._id}
                className="border rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: "#EDE6D6",
                  borderColor: isOpen ? "#C8A870" : "#D8C9B4",
                  boxShadow: isOpen
                    ? "0 4px 16px rgba(90,62,43,0.12)"
                    : "0 1px 6px rgba(90,62,43,0.07)",
                }}
              >
                {/* Card header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-[#D8C9B4] bg-[#E8DDD0]">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#9A8A7A] uppercase tracking-widest font-['Inter']">
                        Order
                      </span>
                      <span className="text-sm font-bold text-[#2A1A1A] font-['Inter']">
                        #{order._id}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-[#D8C9B4]" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#9A8A7A] uppercase tracking-widest font-['Inter']">
                        Placed
                      </span>
                      <span className="text-sm font-medium text-[#5A3E2B] font-['Inter']">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-[#D8C9B4] hidden sm:block" />
                    <div className="hidden sm:flex flex-col">
                      <span className="text-[9px] font-bold text-[#9A8A7A] uppercase tracking-widest font-['Inter']">
                        Payment
                      </span>
                      <span className="text-sm font-medium text-[#5A3E2B] font-['Inter'] flex items-center gap-1.5">
                        {order.paymentType === "Online" ? (
                          <CreditCard
                            size={11}
                            className="text-primary shrink-0"
                          />
                        ) : (
                          <Banknote
                            size={11}
                            className="text-secondary shrink-0"
                          />
                        )}
                        {order.paymentType}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${order.isPaid ? "bg-[#EAF3DE] text-[#3F7D3A]" : "bg-[#FAEEDA] text-[#854F0B]"}`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </span>
                    </div>
                    {order.address && (
                      <>
                        <div className="w-px h-8 bg-[#D8C9B4] hidden sm:block" />
                        <div className="hidden sm:flex flex-col">
                          <span className="text-[9px] font-bold text-[#9A8A7A] uppercase tracking-widest font-['Inter']">
                            Deliver to
                          </span>
                          <span className="text-sm font-medium text-[#5A3E2B] font-['Inter'] flex items-center gap-1">
                            <MapPin
                              size={11}
                              className="text-primary shrink-0"
                            />
                            {order.address.city}, {order.address.state}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold font-['Inter'] ${status.classes}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot} ${order.status !== "Delivered" && order.status !== "Cancelled" ? "animate-pulse" : ""}`}
                    />
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
                  {order.items.map((entry) => {
                    const item = entry.product;
                    const image = Array.isArray(item.image)
                      ? item.image[0]
                      : item.image;
                    const hasOffer =
                      item.offerPrice != null &&
                      item.offerPrice > 0 &&
                      item.offerPrice < item.price;
                    const price = hasOffer ? item.offerPrice : item.price;
                    return (
                      <div key={entry._id} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F6F1E7] border border-[#D8C9B4] shrink-0">
                          <img
                            src={image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{ filter: "saturate(1.05) sepia(0.04)" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#2A1A1A] font-['Playfair_Display'] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#9A8A7A] font-['Inter']">
                            Qty: {entry.quantity} · {item.unit ?? "unit"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-primary font-['Inter']">
                            ₹{price * entry.quantity}
                          </p>
                          <p className="text-[10px] text-[#B0A090] font-['Inter']">
                            ₹{price} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── INLINE DROPDOWN ── */}
                {isOpen && <OrderDetail order={order} />}

                {/* Card footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-t border-[#D8C9B4] bg-[#E8DDD0]">
                  <div className="flex flex-col md:flex-row items-baseline md:gap-1.5">
                    <span className="hidden md:block text-xs text-[#9A8A7A] font-['Inter']">
                      {order.items.reduce((s, e) => s + e.quantity, 0)} item
                      {order.items.length !== 1 ? "s" : ""}
                    </span>
                    <div>
                      <span className="text-xs text-[#9A8A7A] font-['Inter']">
                        Total{" "}
                      </span>
                      <span className="font-['Playfair_Display'] text-xl font-bold text-primary">
                        ₹{order.amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "Delivered" && (
                      <button className="flex items-center gap-1.5 px-3.5 py-2 border border-[#D8C9B4] hover:border-primary-alt bg-[#F6F1E7] hover:bg-[#EDE6D6] text-[#5A3E2B] text-xs font-semibold rounded-xl font-['Inter'] transition-all">
                        <RotateCcw size={12} /> Reorder
                      </button>
                    )}
                    <button
                      onClick={() => toggle(order._id)}
                      className="flex cursor-pointer items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl font-['Inter'] transition-all"
                      style={{
                        background: isOpen
                          ? "#F6F1E7"
                          : "var(--color-primary, #8B3A2A)",
                        color: isOpen ? "#5A3E2B" : "#F6F1E7",
                        border: isOpen ? "1px solid #D8C9B4" : "none",
                      }}
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp size={12} /> Hide Details
                        </>
                      ) : (
                        <>
                          View Details <ChevronDown size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
