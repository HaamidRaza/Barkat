import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ShoppingBag,
  Filter,
  IndianRupee,
  RefreshCcw,
} from "lucide-react";
import axios from "../../config/api.js";
import toast from "react-hot-toast";
import OrderRow from "./OrderRow.jsx";

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

const ALL_STATUSES = ["All", ...Object.keys(STATUS_CONFIG)];


const StatCard = ({ label, value, icon, accent }) => (
  <div className="orders-stat">
    <div
      className="orders-stat-icon"
      style={{ background: accent + "22", color: accent }}
    >
      {icon}
    </div>
    <div>
      <div className="orders-stat-value">{value}</div>
      <div className="orders-stat-label">{label}</div>
    </div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/order/seller");
      if (data.success) setOrders(data.orders);
      else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
    );
  };
  const handlePaymentChange = (orderId, newIsPaid) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, isPaid: newIsPaid } : o)),
    );
  };

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((s, o) => s + o.amount, 0);
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const pending = orders.filter((o) => o.status !== "Delivered").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .orders-root {
          min-height: 100vh;
          background: #F5EDD8;
          background-image:
            radial-gradient(ellipse 60% 40% at 90% 5%, #EAD4A040 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 95%, #D4B88030 0%, transparent 55%);
          padding: 24px 16px 40px;
          font-family: 'DM Sans', sans-serif;
        }
        @media (min-width: 640px)  { .orders-root { padding: 32px 28px 48px; } }
        @media (min-width: 1024px) { .orders-root { padding: 36px 40px 56px; } }

        /* Header */
        .orders-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .orders-title { font-family:'Lora',serif; font-size:28px; font-weight:700; color:#2A1A0A; margin:0 0 4px; line-height:1.2; }
        .orders-subtitle { font-size:13px; color:#9A8060; margin:0; }
        .orders-refresh {
          background:#8B3A2A; color:#FAF0DC; border:none; border-radius:10px;
          padding:9px 16px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif;
          cursor:pointer; transition:background 0.15s,transform 0.1s;
          display:flex; align-items:center; gap:6px;
        }
        .orders-refresh:hover { background:#7A2E1E; transform:translateY(-1px); }
        .orders-refresh:active { transform:scale(0.97); }

        /* Stats */
        .orders-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:20px; }
        .orders-stat {
          background:#FEFAF2; border:1px solid #DDD0B0; border-radius:14px;
          padding:14px 16px; display:flex; align-items:center; gap:12px;
          box-shadow:0 1px 4px #7A4A1A0C;
        }
        .orders-stat-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .orders-stat-value { font-family:'Lora',serif; font-size:20px; font-weight:700; color:#2A1A0A; line-height:1; }
        .orders-stat-label { font-size:11px; color:#9A8060; font-weight:500; margin-top:3px; }

        /* Filter bar */
        .orders-filter-bar { display:flex; align-items:center; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
        .orders-filter-label {
          font-size:11px; font-weight:600; color:#7A5A3A;
          text-transform:uppercase; letter-spacing:0.08em;
          display:flex; align-items:center; gap:4px; margin-right:4px;
        }
        .orders-filter-btn {
          padding:5px 12px; border-radius:20px; border:1.5px solid #D8C9A8;
          background:#FEFAF2; font-size:11px; font-weight:600; color:#7A5A3A;
          cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif;
        }
        .orders-filter-btn:hover { border-color:#8B3A2A; color:#8B3A2A; }
        .orders-filter-btn.active { background:#8B3A2A; border-color:#8B3A2A; color:#FAF0DC; }

        /* Table card */
        .orders-card { background:#FEFAF2; border:1px solid #DDD0B0; border-radius:18px; overflow:hidden; box-shadow:0 2px 12px #7A4A1A0E; }

        /* Table head */
        .orders-table-head {
          display:grid;
          grid-template-columns: 60px 1fr 80px 60px 140px 32px;
          gap:8px; align-items:center; padding:10px 16px;
          background:#EDE4CE; border-bottom:1px solid #DDD0B0;
          font-size:10px; font-weight:700; text-transform:uppercase;
          letter-spacing:0.08em; color:#7A5A3A;
        }
        @media (max-width:639px) { .orders-table-head { display:none; } }

        /* Row wrapper */
        .orders-row-wrapper {
          border-bottom: 1px solid #EDE4CE;
          animation: orders-row-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
          transition: box-shadow 0.2s;
        }
        .orders-row-wrapper:last-child { border-bottom: none; }
        .orders-row-wrapper.open { box-shadow: inset 3px 0 0 #8B3A2A; }
        @keyframes orders-row-in {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }

        /* Row */
        .orders-row {
          display:grid;
          grid-template-columns: 60px 1fr 80px 60px 140px 32px;
          gap:8px; align-items:center; padding:12px 16px;
          cursor:pointer; transition:background 0.15s;
        }
        .orders-row:hover { background:#FAF5EC; }
        @media (max-width:639px) {
          .orders-row {
            grid-template-columns: 48px 1fr auto;
            grid-template-rows: auto auto;
          }
          .orders-pay-badge { display:none; }
        }

        /* Thumb */
        .orders-thumb-stack { position:relative; width:48px; }
        .orders-thumb { width:48px; height:48px; border-radius:10px; object-fit:cover; border:1px solid #D8C9A8; background:#EDE6D6; display:block; }
        .orders-thumb-placeholder {
          width:48px; height:48px; border-radius:10px; background:#EDE6D6;
          border:1px solid #D8C9A8; display:flex; align-items:center; justify-content:center; color:#B0A080;
        }
        .orders-thumb-more {
          position:absolute; bottom:-4px; right:-4px;
          background:#8B3A2A; color:#FAF0DC; font-size:9px; font-weight:700;
          padding:1px 5px; border-radius:8px; border:1.5px solid #FEFAF2;
        }

        /* Row info */
        .orders-row-info { min-width:0; }
        .orders-row-id { font-size:12px; font-weight:600; color:#2A1A0A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-family:'Lora',serif; }
        .orders-row-meta { font-size:11px; color:#9A8060; margin-top:2px; display:flex; align-items:center; gap:4px; flex-wrap:wrap; }
        .orders-dot { color:#D0C0A0; }

        .orders-row-amount { font-size:14px; font-weight:700; color:#8B3A2A; font-family:'Lora',serif; white-space:nowrap; }
        .orders-pay-badge  { font-size:11px; font-weight:700; white-space:nowrap; }
        .orders-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 9px; border-radius:20px; border:1px solid;
          font-size:11px; font-weight:700; white-space:nowrap;
        }
        @media (max-width:639px) {
          .orders-status-pill { grid-column:2 / span 2; width:fit-content; }
        }

        .orders-chevron { color:#C0A888; justify-self:end; display:flex; align-items:center; }
        .orders-row:hover .orders-chevron { color:#8B3A2A; }
        .orders-row-wrapper.open .orders-chevron { color:#8B3A2A; }

        /* Inline detail panel */
        .orders-detail-panel {
          border-top: 1px solid #E8D8B8;
          animation: panel-in 0.25s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes panel-in {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Empty */
        .orders-empty { padding:48px 24px; display:flex; flex-direction:column; align-items:center; gap:10px; color:#9A8060; font-size:13px; }
        .orders-empty-icon { width:52px; height:52px; border-radius:50%; background:#EDE6D6; display:flex; align-items:center; justify-content:center; color:#B0A080; margin-bottom:4px; }
        .orders-empty strong { font-family:'Lora',serif; font-size:16px; color:#4A3020; }
      `}</style>

      <div className="orders-root">
        <div className="orders-header">
          <div>
            <h1 className="orders-title">Orders</h1>
            <p className="orders-subtitle">
              {orders.length} total orders in your store
            </p>
          </div>
          <button className="orders-refresh" onClick={fetchOrders}>
            <RefreshCcw size={13} /> Refresh
          </button>
        </div>

        <div className="orders-stats">
          <StatCard
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={16} />}
            accent="#8B3A2A"
          />
          <StatCard
            label="Total Orders"
            value={orders.length}
            icon={<ShoppingBag size={16} />}
            accent="#4A7CC7"
          />
          <StatCard
            label="Delivered"
            value={delivered}
            icon={<CheckCircle2 size={16} />}
            accent="#3F7D3A"
          />
          <StatCard
            label="Pending"
            value={pending}
            icon={<Clock size={16} />}
            accent="#C8920A"
          />
        </div>

        <div className="orders-filter-bar">
          <span className="orders-filter-label">
            <Filter size={11} /> Filter
          </span>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              className={`orders-filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="orders-card">
          <div className="orders-table-head">
            <span>Item</span>
            <span>Order</span>
            <span>Amount</span>
            <span>Payment</span>
            <span>Status</span>
            <span />
          </div>

          {filtered.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">
                <Package size={22} />
              </div>
              <strong>No orders found</strong>
              <span>Try a different filter</span>
            </div>
          ) : (
            filtered.map((order, idx) => (
              <OrderRow
                key={order._id}
                order={order}
                index={idx}
                isOpen={expandedId === order._id}
                onToggle={() => toggle(order._id)}
                onStatusChange={handleStatusChange}
                onPaymentChange={handlePaymentChange}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
