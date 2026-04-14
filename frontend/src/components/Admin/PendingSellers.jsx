import { useEffect, useState } from "react";
import axios from "../../config/api.js";
import { toast } from "react-toastify";
import { Store, CheckCircle, XCircle, Mail, User } from "lucide-react";

const PendingSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const { data } = await axios.get("/admin/sellers/pending", { withCredentials: true });
    if (data.success) setSellers(data.sellers);
    setLoading(false);
  };

  const handle = async (userId, action) => {
    const { data } = await axios.patch(
      `/admin/sellers/${userId}/${action}`, {}, { withCredentials: true }
    );
    if (data.success) {
      toast.success(data.message);
      setSellers((prev) => prev.filter((s) => s._id !== userId));
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#8B3A2A", borderTopColor: "transparent" }} />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Store size={13} style={{ color: "#8B3A2A" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#9A8060" }}>
            Admin · Seller Applications
          </span>
        </div>
        <h1 className="text-2xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
          Pending Sellers
        </h1>
        {sellers.length > 0 && (
          <p className="text-sm mt-0.5" style={{ color: "#9A8060" }}>
            {sellers.length} application{sellers.length !== 1 ? "s" : ""} awaiting review
          </p>
        )}
      </div>

      {/* Empty state */}
      {sellers.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-center rounded-2xl"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>
          <Store size={32} style={{ color: "#C8B89A" }} />
          <p className="font-semibold" style={{ color: "#6B5140" }}>All clear!</p>
          <p className="text-sm" style={{ color: "#9A8060" }}>No pending seller applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sellers.map((s) => (
            <div key={s._id} className="rounded-2xl overflow-hidden"
              style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>

              {/* Info */}
              <div className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: "#EDE4CE", color: "#8B3A2A" }}>
                  {s.name?.[0]?.toUpperCase() || "S"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: "#1E1008" }}>
                      {s.name}
                    </p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{ background: "#FFF8E6", color: "#92650A" }}>
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs"
                    style={{ color: "#9A8060" }}>
                    <Mail size={11} />
                    {s.email}
                  </div>
                  {s.shopName && (
                    <div className="flex items-center gap-1.5 text-xs mt-0.5"
                      style={{ color: "#9A8060" }}>
                      <Store size={11} />
                      {s.shopName}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 px-4 pb-4">
                <button
                  onClick={() => handle(s._id, "approve")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ background: "#EDFAF3", color: "#1A6B40" }}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => handle(s._id, "reject")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ background: "#FDEEEE", color: "#922020" }}
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingSellers;