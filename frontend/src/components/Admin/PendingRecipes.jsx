import { useEffect, useState } from "react";
import axios from "../../config/api.js";
import { toast } from "react-toastify";
import { ChefHat, Clock, CheckCircle, XCircle, X } from "lucide-react";

const PendingRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [reason, setReason] = useState("");

  const fetchPending = async () => {
    try {
      const { data } = await axios.get("/admin/recipes/pending", { withCredentials: true });
      if (data.success) setRecipes(data.recipes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id) => {
    const { data } = await axios.post(`/admin/recipes/${id}/approve`, {}, { withCredentials: true });
    if (data.success) {
      toast.success("Recipe approved");
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } else toast.error(data.message);
  };

  const confirmReject = async () => {
    const { data } = await axios.post(
      `/admin/recipes/${rejectModal.id}/reject`,
      { reason },
      { withCredentials: true }
    );
    if (data.success) {
      toast.success("Recipe rejected");
      setRecipes((prev) => prev.filter((r) => r._id !== rejectModal.id));
      setRejectModal({ open: false, id: null });
    } else toast.error(data.message);
  };

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
          <ChefHat size={13} style={{ color: "#8B3A2A" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9A8060" }}>
            Admin · Review Queue
          </span>
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
          Pending Recipes
        </h1>
        {recipes.length > 0 && (
          <p className="text-sm mt-0.5" style={{ color: "#9A8060" }}>
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} awaiting review
          </p>
        )}
      </div>

      {/* Empty state */}
      {recipes.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-center rounded-2xl"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>
          <ChefHat size={32} style={{ color: "#C8B89A" }} />
          <p className="font-semibold" style={{ color: "#6B5140" }}>All clear!</p>
          <p className="text-sm" style={{ color: "#9A8060" }}>No recipes pending review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((r) => (
            <div key={r._id} className="rounded-2xl overflow-hidden"
              style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>

              {/* Top section */}
              <div className="flex gap-3 p-4">
                {r.photo ? (
                  <img src={r.photo} alt={r.title}
                    className="w-16 h-16 object-cover rounded-xl shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "#EDE4CE" }}>
                    <ChefHat size={20} style={{ color: "#B8A48A" }} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm mb-0.5 leading-snug"
                    style={{ color: "#1E1008" }}>
                    {r.title}
                  </h2>
                  {r.description && (
                    <p className="text-xs line-clamp-2 mb-1" style={{ color: "#6B5140" }}>
                      {r.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    <p className="text-xs" style={{ color: "#9A8060" }}>
                      By <span className="font-medium" style={{ color: "#1E1008" }}>
                        {r.submittedBy?.name}
                      </span>
                    </p>
                    <p className="text-xs" style={{ color: "#9A8060" }}>
                      {r.submittedBy?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta strip */}
              <div className="flex items-center gap-4 px-4 pb-3 flex-wrap">
                <div className="flex items-center gap-1 text-xs" style={{ color: "#B8A48A" }}>
                  <Clock size={11} />
                  {r.prepTime + r.cookTime} min total
                </div>
                <span className="text-xs" style={{ color: "#B8A48A" }}>
                  {r.ingredients.length} ingredients
                </span>
                <span className="text-xs" style={{ color: "#B8A48A" }}>
                  {r.steps.length} steps
                </span>
                {r.videoUrl && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#FDEEEE", color: "#922020" }}>
                    Has video
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 px-4 pb-4">
                <button
                  onClick={() => approve(r._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ background: "#EDFAF3", color: "#1A6B40" }}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => { setRejectModal({ open: true, id: r._id }); setReason(""); }}
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

      {/* Reject modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(30,16,8,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
                Rejection reason
              </h2>
              <button onClick={() => setRejectModal({ open: false, id: null })}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "#EDE4CE", color: "#6B5140" }}>
                <X size={13} />
              </button>
            </div>
            <textarea
              className="w-full text-sm outline-none resize-none rounded-xl px-4 py-3"
              style={{ background: "#FAF5EC", border: "1px solid #E0D2B4", color: "#1E1008" }}
              rows={3}
              placeholder="Optional — shown to the user..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={confirmReject}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                style={{ background: "#8B3A2A", color: "#FFECD0" }}
              >
                Confirm reject
              </button>
              <button
                onClick={() => setRejectModal({ open: false, id: null })}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#EDE4CE", color: "#6B5140" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRecipes;