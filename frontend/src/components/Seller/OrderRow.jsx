import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ChevronUp,
  ShoppingBag,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import axios from "../../config/api.js";
import toast from "react-hot-toast";
import OrderDetail from "../OrderDetail";

const STATUS_CONFIG = {
  "Order Placed": {
    color: "#4A7CC7",
    bg: "#EAF0FB",
    border: "#C0D3F5",
    icon: <Package size={11} />,
  },
  Processing: {
    color: "#C8920A",
    bg: "#FDF3DC",
    border: "#F0D98A",
    icon: <Clock size={11} />,
  },
  "Out for Delivery": {
    color: "#D4720A",
    bg: "#FEF0E0",
    border: "#F5C88A",
    icon: <Truck size={11} />,
  },
  Delivered: {
    color: "#3F7D3A",
    bg: "#EAF3DE",
    border: "#B8DFA8",
    icon: <CheckCircle2 size={11} />,
  },
};

const fmtDate = (str) =>
  new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtTime = (str) =>
  new Date(str).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const OrderRow = ({
  order,
  isOpen,
  onToggle,
  index,
  onStatusChange,
  onPaymentChange,
}) => {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["Order Placed"];
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPay, setUpdatingPay] = useState(false);

  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
  const firstImg = (() => {
    const img = order.items[0]?.product?.image;
    return Array.isArray(img) ? img[0] : img;
  })();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdatingStatus(true);
    try {
      await toast.promise(
        axios.patch("/order/status", {
          orderId: order._id,
          status: newStatus,
        }),
        {
          loading: "Updating status...",
          success: (response) => {
            const { data } = response;
            if (data.success) {
              onStatusChange(order._id, newStatus);
              return "Status updated";
            } else {
              throw new Error(data.message || "Failed to update status");
            }
          },
          error: (err) => {
            return err.response?.data?.message || err.message || "Failed to update status";
          },
        }
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentToggle = async () => {
    setUpdatingPay(true);
    try {
      await toast.promise(
        axios.patch("/order/payment-status", {
          orderId: order._id,
          isPaid: !order.isPaid,
        }),
        {
          loading: "Updating payment status...",
          success: (response) => {
            const { data } = response;
            if (data.success) {
              onPaymentChange(order._id, !order.isPaid);
              return "Payment status updated";
            } else {
              throw new Error(data.message || "Failed to update payment");
            }
          },
          error: (err) => {
            return err.response?.data?.message || err.message || "Failed to update payment";
          },
        }
      );
    } finally {
      setUpdatingPay(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .orow-wrapper { border-bottom: 1px solid #EDE4CE; transition: box-shadow 0.2s; font-family: 'DM Sans', sans-serif; }
        .orow-wrapper:last-child { border-bottom: none; }
        .orow-wrapper.open { box-shadow: inset 3px 0 0 #8B3A2A; background: #FAF8F2; }
        @keyframes orow-in { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .orow-wrapper { animation: orow-in 0.35s cubic-bezier(.22,1,.36,1) both; }

        .orow {
          display: grid;
          grid-template-columns: 56px 1fr 80px 52px 148px 32px;
          gap: 8px; align-items: center;
          padding: 12px 16px;
          cursor: pointer; transition: background 0.15s;
        }
        .orow:hover { background: #FAF5EC; }
        @media (max-width: 639px) {
          .orow { grid-template-columns: 44px 1fr auto; grid-template-rows: auto auto; gap: 6px; }
          .orow-pay { display: none !important; }
        }

        .orow-thumb-stack { position: relative; width: 44px; }
        .orow-thumb { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid #D8C9A8; background: #EDE6D6; display: block; }
        .orow-thumb-ph { width: 44px; height: 44px; border-radius: 10px; background: #EDE6D6; border: 1px solid #D8C9A8; display: flex; align-items: center; justify-content: center; color: #B0A080; }
        .orow-thumb-more { position: absolute; bottom: -4px; right: -4px; background: #8B3A2A; color: #FAF0DC; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 8px; border: 1.5px solid #FEFAF2; }

        .orow-info { min-width: 0; }
        .orow-id { font-size: 12px; font-weight: 600; color: #2A1A0A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Lora', serif; }
        .orow-meta { font-size: 11px; color: #9A8060; margin-top: 2px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .orow-dot { color: #D0C0A0; }

        .orow-amount { font-size: 14px; font-weight: 700; color: #8B3A2A; font-family: 'Lora', serif; white-space: nowrap; }
        .orow-pay { font-size: 11px; font-weight: 700; white-space: nowrap; }

        .orow-status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 20px; border: 1px solid; font-size: 11px; font-weight: 700; white-space: nowrap; }
        @media (max-width: 639px) { .orow-status-pill { grid-column: 2 / span 2; width: fit-content; } }

        .orow:hover .orow-chevron { color: #8B3A2A; }
        .orow-wrapper.open .orow-chevron { color: #8B3A2A; }

        /* Detail panel */
        .orow-panel { border-top: 1px solid #E8D8B8; }
        @keyframes panel-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .orow-panel { animation: panel-in 0.22s cubic-bezier(.22,1,.36,1) both; }

        /* Controls bar */
        .orow-controls { display: flex; align-items: center; gap: 0; background: #F0E8D4; border-bottom: 1px solid #E0D0B0; flex-wrap: wrap; }
        .orow-control-cell { display: flex; align-items: center; gap: 10px; padding: 10px 16px; flex: 1; min-width: 220px; }
        .orow-control-cell + .orow-control-cell { border-left: 1px solid #E0D0B0; }
        @media (max-width: 540px) { .orow-control-cell + .orow-control-cell { border-left: none; border-top: 1px solid #E0D0B0; } }
        .orow-ctrl-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9A7A50; white-space: nowrap; flex-shrink: 0; }
      `}</style>

      <div
        className={`orow-wrapper ${isOpen ? "open" : ""}`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* ── Clickable row ── */}
        <div className="orow" onClick={onToggle}>
          <div className="orow-thumb-stack">
            {firstImg ? (
              <img src={firstImg} alt="" className="orow-thumb" />
            ) : (
              <div className="orow-thumb-ph">
                <ShoppingBag size={15} />
              </div>
            )}
            {order.items.length > 1 && (
              <span className="orow-thumb-more">+{order.items.length - 1}</span>
            )}
          </div>

          <div className="orow-info">
            <div className="orow-id">{order._id}</div>
            <div className="orow-meta">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
              <span className="orow-dot">·</span>
              {fmtDate(order.createdAt)}
              <span className="orow-dot">·</span>
              {fmtTime(order.createdAt)}
            </div>
          </div>

          <div className="orow-amount">₹{order.amount}</div>

          <div
            className="orow-pay"
            style={{ color: order.isPaid ? "#3F7D3A" : "#D4720A" }}
          >
            {order.isPaid ? "Paid" : "COD"}
          </div>

          <div
            className="orow-status-pill"
            style={{
              color: status.color,
              background: status.bg,
              borderColor: status.border,
            }}
          >
            {status.icon}
            <span>{order.status}</span>
          </div>
          <div className="text-[#C0A888] flex justify-self-start md:justify-self-end items-center transition-colors duration-10">
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>

        {/* ── Expanded panel ── */}
        {isOpen && (
          <div className="orow-panel" onClick={(e) => e.stopPropagation()}>
            {/* Controls bar */}
            <div className="orow-controls">
              {/* Status selector */}
              <div className="orow-control-cell">
                <span className="orow-ctrl-label">Status</span>
                <div className="relative flex items-center gap-2 flex-1">
                  <select
                    value={order.status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus}
                    className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg outline-none cursor-pointer appearance-none transition-all"
                    style={{
                      background: status.bg,
                      border: `1.5px solid ${status.border}`,
                      color: status.color,
                      fontFamily: "'DM Sans', sans-serif",
                      opacity: updatingStatus ? 0.6 : 1,
                      minWidth: 0,
                    }}
                  >
                    {Object.keys(STATUS_CONFIG).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {updatingStatus && (
                    <RefreshCw
                      size={12}
                      className="animate-spin shrink-0"
                      style={{ color: "#9A8060" }}
                    />
                  )}
                </div>
              </div>

              {/* Payment toggle */}
              <div className="orow-control-cell">
                <span className="orow-ctrl-label">Payment</span>
                <button
                  onClick={handlePaymentToggle}
                  disabled={updatingPay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: order.isPaid ? "#EAF3DE" : "#FEF0E0",
                    color: order.isPaid ? "#3F7D3A" : "#D4720A",
                    border: `1.5px solid ${order.isPaid ? "#B8DFA8" : "#F5C88A"}`,
                    opacity: updatingPay ? 0.6 : 1,
                    cursor: updatingPay ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!updatingPay)
                      e.currentTarget.style.filter = "brightness(0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "none";
                  }}
                >
                  {updatingPay ? (
                    <RefreshCw size={11} className="animate-spin" />
                  ) : order.isPaid ? (
                    <CheckCircle2 size={11} />
                  ) : (
                    <Clock size={11} />
                  )}
                  {updatingPay
                    ? "Updating…"
                    : order.isPaid
                      ? "Paid · Mark unpaid"
                      : "Unpaid · Mark paid"}
                </button>
              </div>
            </div>

            {/* Order detail */}
            <OrderDetail order={order} />
          </div>
        )}
      </div>
    </>
  );
};

export default OrderRow;
