import { useEffect, useState } from "react";
import axios from "../../config/api.js"

const ROLE_STYLE = {
  admin:  { bg: "#E8EDF5", color: "#2A3F6B" },
  seller: { bg: "#EDF5E8", color: "#2A6B3F" },
  user:   { bg: "#F5F0E8", color: "#6B5140" },
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/admin/users", { withCredentials: true })
      .then(({ data }) => { if (data.success) setUsers(data.users); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center" style={{ color: "#9A8060" }}>Loading...</div>;

  return (
    <div className="p-3 md:p-8">
      <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
        All Users <span className="text-sm font-normal" style={{ color: "#9A8060" }}>({users.length})</span>
      </h2>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E0D2B4" }}>
        {/* Header */}
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold uppercase"
          style={{ background: "#EDE4CE", color: "#9A8060", letterSpacing: "0.06em" }}>
          <span className="col-span-5">Name / Email</span>
          <span className="col-span-3">Role</span>
          <span className="col-span-4">Seller Status</span>
        </div>

        {users.map((u, i) => {
          const roleStyle = ROLE_STYLE[u.role] || ROLE_STYLE.user;
          return (
            <div key={u._id}
              className="grid grid-cols-12 px-4 py-3 items-center text-sm border-t"
              style={{ borderColor: "#E0D2B4", background: i % 2 === 0 ? "#FEFAF2" : "#FAF5EC" }}>
              <div className="col-span-5">
                <p className="font-medium" style={{ color: "#1E1008" }}>{u.name}</p>
                <p className="text-xs" style={{ color: "#9A8060" }}>{u.email}</p>
              </div>
              <div className="col-span-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: roleStyle.bg, color: roleStyle.color }}>
                  {u.role}
                </span>
              </div>
              <div className="col-span-4">
                {u.sellerStatus !== "none" ? (
                  <span className="text-xs" style={{ color: "#9A8060" }}>{u.sellerStatus}</span>
                ) : (
                  <span className="text-xs" style={{ color: "#C8B89A" }}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllUsers;