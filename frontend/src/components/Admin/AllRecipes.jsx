import { useState, useEffect } from "react";
import axios from "../../config/api.js";
import { toast } from "react-toastify";
import { Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAppContext } from "../../context/AppContext.jsx";

const STATUS_STYLE = {
  pending: { bg: "#FFF8E6", color: "#92650A", dot: "#F0A500" },
  approved: { bg: "#EDFAF3", color: "#1A6B40", dot: "#27AE60" },
  rejected: { bg: "#FDEEEE", color: "#922020", dot: "#E53935" },
};

const AllRecipes = () => {
  const { navigate } = useAppContext();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [rejectReason, setRejectReason] = useState({});

  const fetch = () => {
    setLoading(true);
    axios.get("/admin/recipes/all").then(({ data }) => {
      if (data.success) setRecipes(data.recipes);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  const approve = async (id) => {
    const { data } = await axios.post(`/admin/recipes/${id}/approve`);
    if (data.success) {
      toast.success("Approved");
      fetch();
    }
  };

  const reject = async (id) => {
    const { data } = await axios.post(`/admin/recipes/${id}/reject`, {
      reason: rejectReason[id] || "",
    });
    if (data.success) {
      toast.success("Rejected");
      fetch();
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this recipe permanently?")) return;
    const { data } = await axios.delete(`/admin/recipes/${id}`);
    if (data.success) {
      toast.success("Deleted");
      fetch();
    }
  };

  const filtered =
    filter === "all" ? recipes : recipes.filter((r) => r.status === filter);

  const counts = {
    all: recipes.length,
    pending: recipes.filter((r) => r.status === "pending").length,
    approved: recipes.filter((r) => r.status === "approved").length,
    rejected: recipes.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#1E1008" }}>
            All Community Recipes
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9A8060" }}>
            {counts.all} total · {counts.pending} pending · {counts.approved}{" "}
            approved
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className="px-4 py-1.5 cursor-pointer rounded-full text-xs font-semibold capitalize transition-all"
            style={
              filter === tab
                ? { background: "#8B3A2A", color: "#E8EDF5" }
                : { background: "#EDE4CE", color: "#6B5140" }
            }
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-sm" style={{ color: "#9A8060" }}>
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: "#9A8060" }}>
          No recipes in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const s = STATUS_STYLE[r.status];
            return (
              <div
                key={r._id}
                className="rounded-2xl p-4"
                style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}
              >
                {/* Top row — photo + title + delete */}
                <div className="flex gap-3 mb-3">
                  {r.photo ? (
                    <img
                      src={r.photo}
                      alt={r.title}
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-xs"
                      style={{ background: "#EDE4CE", color: "#B8A48A" }}
                    >
                      No photo
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2
                        onClick={() => navigate(`/community-recipes/${r._id}`)}
                        className="font-semibold text-sm cursor-pointer hover:underline leading-snug"
                        style={{ color: "#1E1008" }}
                      >
                        {r.title}
                      </h2>
                      <button
                        onClick={() => remove(r._id)}
                        className="p-1 rounded-lg shrink-0"
                        style={{ color: "#E53935" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Status badge */}
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1"
                      style={{ background: s.bg, color: s.color }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: s.dot }}
                      />
                      {r.status}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-0.5 mb-3">
                  <p className="text-xs" style={{ color: "#9A8060" }}>
                    By {r.submittedBy?.name || "—"} ·{" "}
                    {r.submittedBy?.email || ""}
                  </p>
                  {r.description && (
                    <p
                      className="text-xs line-clamp-2"
                      style={{ color: "#6B5140" }}
                    >
                      {r.description}
                    </p>
                  )}
                  <p className="text-xs" style={{ color: "#B8A48A" }}>
                    {r.ingredients?.length} ingredients · {r.steps?.length}{" "}
                    steps · {r.prepTime + r.cookTime} mins
                  </p>
                  {r.status === "rejected" && r.rejectionReason && (
                    <p className="text-xs" style={{ color: "#E53935" }}>
                      Reason: {r.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Actions — full width on mobile */}
                <div className="flex flex-col gap-2">
                  {r.status !== "approved" && (
                    <button
                      onClick={() => approve(r._id)}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold"
                      style={{ background: "#EDFAF3", color: "#1A6B40" }}
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                  )}

                  {r.status !== "rejected" && (
                    <div className="flex items-center gap-2">
                      <input
                        placeholder="Rejection reason (optional)"
                        value={rejectReason[r._id] || ""}
                        onChange={(e) =>
                          setRejectReason({
                            ...rejectReason,
                            [r._id]: e.target.value,
                          })
                        }
                        className="flex-1 text-xs border rounded-xl px-3 py-2 outline-none min-w-0"
                        style={{
                          borderColor: "#E0D2B4",
                          background: "#FAF5EC",
                        }}
                      />

                      <button
                        onClick={() => reject(r._id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap"
                        style={{ background: "#FDEEEE", color: "#922020" }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllRecipes;
