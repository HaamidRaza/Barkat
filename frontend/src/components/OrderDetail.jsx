import React from "react";
import {
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  Calendar,
  Hash,
  User,
  ShoppingBag,
  Phone,
  IndianRupee,
  ChevronUp,
} from "lucide-react";

const STATUS_CONFIG = {
  "Order Placed": {
    color: "#C8920A",
    bg: "#FDF3DC",
    border: "#F0D98A",
    icon: Package,
    step: 1,
  },
  Processing: {
    color: "#C8920A",
    bg: "#FDF3DC",
    border: "#F0D98A",
    icon: Clock,
    step: 2,
  },
  "Out for Delivery": {
    color: "#D4720A",
    bg: "#FEF0E0",
    border: "#F5C88A",
    icon: Truck,
    step: 3,
  },
  Delivered: {
    color: "#3F7D3A",
    bg: "#EAF3DE",
    border: "#B8DFA8",
    icon: CheckCircle2,
    step: 4,
  },
};

const STEPS = ["Order Placed", "Processing", "Out for Delivery", "Delivered"];

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Row = ({ label, children }) => (
  <div
    className="flex justify-between items-center text-sm"
    style={{ color: "#7A5A3A" }}
  >
    <span>{label}</span>
    <span className="font-medium" style={{ color: "#4A3020" }}>
      {children}
    </span>
  </div>
);

const OrderDetail = ({ order }) => {
  if (!order) return null;

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["Order Placed"];
  const StatusIcon = status.icon;
  const currentStep = status.step;
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
  const shipping = order.amount >= 499 ? 0 : 49;
  const tax = Math.round(order.amount * 0.02);
  const total = order.amount + shipping + tax;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .od-inner * { font-family: 'DM Sans', sans-serif; }
        .od-serif   { font-family: 'Lora', serif !important; }
        .od-step-connector { position:absolute; top:14px; left:calc(50% + 16px); right:calc(-50% + 16px); height:2px; z-index:0; }
        @keyframes od-expand { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
        .od-expand { animation: od-expand .25s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div
        className="od-inner od-expand"
        style={{ background: "#FAF6EE", borderTop: "1px solid #E8D8B8" }}
      >
        <div className="px-4 sm:px-5 py-5 flex flex-col gap-4">
          {/* ── TRACKING ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #E8D8B8", background: "#FEFAF2" }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{
                borderBottom: "1px solid #EDE4CE",
                background: "#F5EDD8",
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#9A7A50" }}
              >
                Tracking
              </span>
            </div>
            <div className="px-4 py-4">
              <div className="flex items-start">
                {STEPS.map((step, idx) => {
                  const num = idx + 1;
                  const done = num < currentStep;
                  const active = num === currentStep;
                  const Ic = STATUS_CONFIG[step].icon;
                  return (
                    <div
                      key={step}
                      className="flex-1 flex flex-col items-center relative"
                    >
                      {idx < STEPS.length - 1 && (
                        <div
                          className="od-step-connector"
                          style={{ background: done ? "#3F7D3A" : "#E0D0B0" }}
                        />
                      )}
                      <div
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center relative z-10 transition-all"
                        style={{
                          background: done
                            ? "#3F7D3A"
                            : active
                              ? "#8B3A2A"
                              : "#F5EDD8",
                          borderColor: done
                            ? "#3F7D3A"
                            : active
                              ? "#8B3A2A"
                              : "#E0D0B0",
                          color: done || active ? "#fff" : "#C0A880",
                          boxShadow: active
                            ? "0 0 0 3px #8B3A2A18"
                            : done
                              ? "0 0 0 3px #3F7D3A18"
                              : "none",
                        }}
                      >
                        {done ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Ic size={12} strokeWidth={2} />
                        )}
                      </div>
                      <span
                        className="text-center font-semibold mt-1.5 leading-tight"
                        style={{
                          fontSize: 8,
                          letterSpacing: "0.04em",
                          maxWidth: 50,
                          lineHeight: 1.3,
                          color: done || active ? "#3A2210" : "#B0A080",
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ── ITEMS ── */}
            <div
              className="rounded-2xl overflow-hidden col-span-1"
              style={{ border: "1px solid #E8D8B8", background: "#FEFAF2" }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  borderBottom: "1px solid #EDE4CE",
                  background: "#F5EDD8",
                }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#9A7A50" }}
                >
                  Items
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#EDE4CE", color: "#7A5A3A" }}
                >
                  {totalItems}
                </span>
              </div>
              {order.items.map((item, i) => {
                const p = item.product;
                const hasOffer =
                  p.offerPrice != null &&
                  p.offerPrice > 0 &&
                  p.offerPrice < p.price;
                const price = hasOffer ? p.offerPrice : p.price;
                const imgSrc = Array.isArray(p?.image) ? p.image[0] : p?.image;
                return (
                  <div
                    key={item._id ?? i}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      borderBottom:
                        i < order.items.length - 1
                          ? "1px solid #EDE4CE"
                          : "none",
                    }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={p?.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        style={{ border: "1px solid #E0D0B0" }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "#EDE4CE",
                          border: "1px solid #E0D0B0",
                          color: "#C0A880",
                        }}
                      >
                        <ShoppingBag size={16} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="od-serif text-sm font-semibold truncate"
                        style={{ color: "#2A1A0A" }}
                      >
                        {p?.name ?? "Product"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: "#EDE4CE", color: "#7A5A3A" }}
                        >
                          Qty {item.quantity}
                        </span>
                        {p?.unit && (
                          <span
                            className="text-[10px]"
                            style={{ color: "#9A8060" }}
                          >
                            {p.unit}
                          </span>
                        )}
                      </div>
                      <p
                        className="flex items-center gap-0.5 text-[10px] mt-0.5"
                        style={{ color: "#9A8060" }}
                      >
                        <IndianRupee size={9} strokeWidth={2} />
                        {price} × {item.quantity}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-0.5 text-sm font-bold flex-shrink-0 od-serif"
                      style={{ color: "#8B3A2A" }}
                    >
                      <IndianRupee size={12} strokeWidth={2.5} />
                      {price * item.quantity}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── PAYMENT SUMMARY ── */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E8D8B8", background: "#FEFAF2" }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{
                  borderBottom: "1px solid #EDE4CE",
                  background: "#F5EDD8",
                }}
              >
                <CreditCard size={11} style={{ color: "#B89060" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#9A7A50" }}
                >
                  Payment Summary
                </span>
              </div>
              <div className="px-4 py-3 flex flex-col gap-2.5">
                <Row label={`Subtotal (${totalItems} items)`}>
                  <span className="flex items-center gap-0.5">
                    <IndianRupee size={11} />
                    {order.amount}
                  </span>
                </Row>
                <Row label="Delivery">
                  {shipping === 0 ? (
                    <span
                      style={{ color: "#3F7D3A" }}
                      className="font-semibold"
                    >
                      Free
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <IndianRupee size={11} />
                      {shipping}
                    </span>
                  )}
                </Row>
                <Row label="Tax">
                  <span className="flex items-center gap-0.5">
                    <IndianRupee size={11} />
                    {tax}
                  </span>
                </Row>
                <div
                  className="flex justify-between items-center pt-2.5"
                  style={{ borderTop: "1.5px dashed #D8C9A8" }}
                >
                  <span
                    className="od-serif text-sm font-semibold"
                    style={{ color: "#2A1A0A" }}
                  >
                    Total
                  </span>
                  <span
                    className="od-serif flex items-center gap-0.5 text-xl font-bold"
                    style={{ color: "#8B3A2A" }}
                  >
                    <IndianRupee size={16} strokeWidth={2.5} />
                    {total}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      background:
                        order.paymentType === "Online" ? "#EAF0FB" : "#FDF3DC",
                      color:
                        order.paymentType === "Online" ? "#4A7CC7" : "#C8920A",
                      borderColor:
                        order.paymentType === "Online" ? "#C0D3F5" : "#F0D98A",
                    }}
                  >
                    {order.paymentType === "Online" ? (
                      <CreditCard size={10} />
                    ) : (
                      <Banknote size={10} />
                    )}
                    {order.paymentType}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      background: order.isPaid ? "#EAF3DE" : "#FEF0E0",
                      color: order.isPaid ? "#3F7D3A" : "#D4720A",
                      borderColor: order.isPaid ? "#B8DFA8" : "#F5C88A",
                    }}
                  >
                    {order.isPaid ? (
                      <ShieldCheck size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── DELIVERY ADDRESS ── */}
            {order.address && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid #E8D8B8", background: "#FEFAF2" }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    borderBottom: "1px solid #EDE4CE",
                    background: "#F5EDD8",
                  }}
                >
                  <MapPin size={11} style={{ color: "#B89060" }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "#9A7A50" }}
                  >
                    Delivery Address
                  </span>
                </div>
                <div className="px-4 py-3 flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#F5EDD8",
                      border: "1px solid #E0D0B0",
                      color: "#8B3A2A",
                    }}
                  >
                    <MapPin size={14} strokeWidth={1.8} />
                  </div>
                  <div>
                    {order.address.firstName && (
                      <p
                        className="od-serif text-sm font-semibold"
                        style={{ color: "#2A1A0A" }}
                      >
                        {order.address.firstName} {order.address.lastName}
                      </p>
                    )}
                    {order.address.phone && (
                      <div
                        className="flex items-center gap-1 text-xs mt-0.5"
                        style={{ color: "#7A5A3A" }}
                      >
                        <Phone size={10} strokeWidth={1.8} />
                        {order.address.phone}
                      </div>
                    )}
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: "#4A3020" }}
                    >
                      {[
                        order.address.street,
                        order.address.city,
                        order.address.state,
                        order.address.zipcode,
                        order.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDER INFO ── */}
            <div
              className="rounded-2xl overflow-hidden col-span-1"
              style={{ border: "1px solid #E8D8B8", background: "#FEFAF2" }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{
                  borderBottom: "1px solid #EDE4CE",
                  background: "#F5EDD8",
                }}
              >
                <Calendar size={11} style={{ color: "#B89060" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#9A7A50" }}
                >
                  Order Info
                </span>
              </div>
              {[
                {
                  icon: Calendar,
                  label: "Placed on",
                  value: fmt(order.createdAt),
                  mono: false,
                },
                {
                  icon: Clock,
                  label: "Last updated",
                  value: fmt(order.updatedAt),
                  mono: false,
                },
                {
                  icon: User,
                  label: "Customer ID",
                  value: order.userId,
                  mono: true,
                },
              ].map(({ icon: Ic, label, value, mono }, i, arr) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 text-xs"
                  style={{
                    borderBottom:
                      i < arr.length - 1 ? "1px solid #EDE4CE" : "none",
                  }}
                >
                  <Ic size={12} style={{ color: "#B89060", flexShrink: 0 }} />
                  <span className="flex-1" style={{ color: "#9A8060" }}>
                    {label}
                  </span>
                  <span
                    className="font-semibold text-right"
                    style={{
                      color: "#2A1A0A",
                      fontFamily: mono ? "monospace" : "inherit",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
