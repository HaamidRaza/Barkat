import { useEffect, useState } from "react";
import axios from "../../config/api.js";
import { Package } from "lucide-react";

const AllAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/admin/products", { withCredentials: true })
      .then(({ data }) => { if (data.success) setProducts(data.products); })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-8 text-center" style={{ color: "#9A8060" }}>Loading...</div>;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl font-semibold mb-6"
        style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}>
        All Products{" "}
        <span className="text-sm font-normal" style={{ color: "#9A8060" }}>
          ({products.length})
        </span>
      </h2>

      {/* ── Desktop table ── */}
      <div className="hidden md:block rounded-2xl border overflow-hidden"
        style={{ borderColor: "#E0D2B4" }}>
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold uppercase"
          style={{ background: "#EDE4CE", color: "#9A8060", letterSpacing: "0.06em" }}>
          <span className="col-span-6">Product</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-2">Stock</span>
          <span className="col-span-2">Seller</span>
        </div>

        {products.map((p, i) => (
          <div key={p._id}
            className="grid grid-cols-12 px-4 py-3 items-center text-sm border-t"
            style={{ borderColor: "#E0D2B4", background: i % 2 === 0 ? "#FEFAF2" : "#FAF5EC" }}>
            <div className="col-span-6 flex items-center gap-3 min-w-0">
              {p.image?.[0] ? (
                <img src={p.image[0]} alt={p.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                  style={{ border: "1px solid #E0D2B4" }} />
              ) : (
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: "#EDE4CE" }}>
                  <Package size={14} style={{ color: "#B8A48A" }} />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium truncate" style={{ color: "#1E1008" }}>{p.name}</p>
                <p className="text-xs truncate" style={{ color: "#9A8060" }}>{p.category}</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="font-semibold" style={{ color: "#2A6B3F" }}>₹{p.offerPrice || p.price}</p>
              {p.offerPrice && p.offerPrice < p.price && (
                <p className="text-xs line-through" style={{ color: "#B8A48A" }}>₹{p.price}</p>
              )}
            </div>
            <div className="col-span-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={p.inStock
                  ? { background: "#EDFAF3", color: "#1A6B40" }
                  : { background: "#FDEEEE", color: "#922020" }}>
                {p.inStock ? "In stock" : "Out"}
              </span>
            </div>
            <div className="col-span-2">
              {p.seller ? (
                <>
                  <p className="text-xs font-medium truncate" style={{ color: "#1E1008" }}>{p.seller.name}</p>
                  <p className="text-xs truncate" style={{ color: "#9A8060" }}>{p.seller.email}</p>
                </>
              ) : (
                <span className="text-xs" style={{ color: "#C8B89A" }}>—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {products.map((p) => (
          <div key={p._id} className="rounded-2xl p-4"
            style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>
            <div className="flex gap-3">
              {/* Image */}
              {p.image?.[0] ? (
                <img src={p.image[0]} alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  style={{ border: "1px solid #E0D2B4" }} />
              ) : (
                <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: "#EDE4CE" }}>
                  <Package size={18} style={{ color: "#B8A48A" }} />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm leading-snug" style={{ color: "#1E1008" }}>
                    {p.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                    style={p.inStock
                      ? { background: "#EDFAF3", color: "#1A6B40" }
                      : { background: "#FDEEEE", color: "#922020" }}>
                    {p.inStock ? "In stock" : "Out"}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: "#9A8060" }}>{p.category}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: "#2A6B3F" }}>
                    ₹{p.offerPrice || p.price}
                  </p>
                  {p.offerPrice && p.offerPrice < p.price && (
                    <p className="text-xs line-through" style={{ color: "#B8A48A" }}>
                      ₹{p.price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Seller row */}
            {p.seller && (
              <div className="mt-3 pt-3 border-t flex items-center gap-2"
                style={{ borderColor: "#E0D2B4" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "#EDE4CE", color: "#6B5140" }}>
                  {p.seller.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#1E1008" }}>
                    {p.seller.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#9A8060" }}>
                    {p.seller.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAdminProducts;