import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Package, Search, Tag, IndianRupee, Filter, ArrowUpDown,
  Trash2, ToggleLeft, ToggleRight, Pencil, X, Check, ImagePlus,
} from "lucide-react";
import axios from '../../config/api.js';
import { toast } from "react-toastify";

/* ── Edit Modal ─────────────────────────────────────────────────────────── */
const EditModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product.name ?? "",
    category: product.category ?? "",
    price: product.price ?? "",
    offerPrice: product.offerPrice ?? "",
    description: Array.isArray(product.description)
      ? product.description.join("\n")
      : (product.description ?? ""),
    unit: product.unit ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: product._id,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        offerPrice: Number(form.offerPrice),
        description: form.description.split("\n").filter(Boolean),
        unit: form.unit,
      };
      const { data } = await axios.post("/product/update", payload);
      if (data.success) {
        toast.success("Product updated");
        onSave({ ...product, ...payload });
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-150`;
  const inputStyle = {
    background: "#FDF7EC", border: "1.5px solid #D9C9A8",
    color: "#1E1008", fontFamily: "'DM Sans', sans-serif",
  };
  const focusInput = (e) => { e.target.style.borderColor = "#8B3A2A"; e.target.style.boxShadow = "0 0 0 3px #8B3A2A18"; };
  const blurInput  = (e) => { e.target.style.borderColor = "#D9C9A8"; e.target.style.boxShadow = "none"; };

  return (
    <>
      <style>{`
        @keyframes em-bg  { from{opacity:0} to{opacity:1} }
        @keyframes em-in  { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .em-backdrop { animation: em-bg .2s ease both; }
        .em-panel    { animation: em-in .3s cubic-bezier(.22,1,.36,1) both; scrollbar-width:thin; scrollbar-color:#D8C9A8 transparent; }
        .em-panel::-webkit-scrollbar { width:4px; }
        .em-panel::-webkit-scrollbar-thumb { background:#D8C9A8; border-radius:9999px; }
      `}</style>

      <div
        className="em-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        style={{ background: "rgba(30,16,8,0.5)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <div
          className="em-panel w-full sm:max-w-lg max-h-[95vh] sm:max-h-[85vh] overflow-y-auto rounded-t-[28px] sm:rounded-[24px]"
          style={{ background: "#FEFAF2", border: "1px solid #DDD0B0", boxShadow: "0 24px 64px #1E100840", fontFamily: "'DM Sans', sans-serif" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 rounded-t-[28px] sm:rounded-t-[24px] overflow-hidden"
            style={{ background: "linear-gradient(135deg,#5C2A14 0%,#8B3A2A 60%,#A84A34 100%)" }}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="sm:hidden w-9 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#FAF0DC99" }}>Editing product</p>
                <h2 className="text-xl font-bold leading-tight" style={{ fontFamily: "'Lora', serif", color: "#FAF0DC" }}>
                  {product.name}
                </h2>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 cursor-pointer rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                style={{ background: "#FFFFFF18", border: "1px solid #FFFFFF28", color: "#FAF0DC" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFFFFF30"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFFFFF18"}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">

            {/* Product image preview */}
            <div className="flex items-center gap-4 p-3 rounded-2xl" style={{ background: "#F5EDD8", border: "1px solid #E8D8B8" }}>
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #E0D0B0" }}>
                <img src={product.image?.[0]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: "#9A8060" }}>Current image</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "#B0A080" }}>Image updates not supported via this form</p>
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EDE4CE", color: "#B0A080" }}>
                <ImagePlus size={14} />
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9A7A50" }}>Product Name</label>
              <input className={inputCls} style={inputStyle} value={form.name} onChange={set("name")} onFocus={focusInput} onBlur={blurInput} placeholder="Product name" />
            </div>

            {/* Category + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9A7A50" }}>Category</label>
                <input className={inputCls} style={inputStyle} value={form.category} onChange={set("category")} onFocus={focusInput} onBlur={blurInput} placeholder="Category" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9A7A50" }}>Unit</label>
                <input className={inputCls} style={inputStyle} value={form.unit} onChange={set("unit")} onFocus={focusInput} onBlur={blurInput} placeholder="e.g. 500g, 1L" />
              </div>
            </div>

            {/* MRP + Offer Price */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9A7A50" }}>MRP (₹)</label>
                <div className="relative">
                  <IndianRupee size={12} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9A8060" }} />
                  <input type="number" className={`${inputCls} pl-7`} style={inputStyle} value={form.price} onChange={set("price")} onFocus={focusInput} onBlur={blurInput} placeholder="0" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9A7A50" }}>Offer Price (₹)</label>
                <div className="relative">
                  <IndianRupee size={12} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9A8060" }} />
                  <input type="number" className={`${inputCls} pl-7`} style={inputStyle} value={form.offerPrice} onChange={set("offerPrice")} onFocus={focusInput} onBlur={blurInput} placeholder="0" />
                </div>
              </div>
            </div>

            {/* Discount preview */}
            {form.price && form.offerPrice && Number(form.price) > Number(form.offerPrice) && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "#EAF3DE", border: "1px solid #B8DFA8", color: "#3F7D3A" }}>
                <Check size={12} strokeWidth={2.5} />
                {Math.round(((form.price - form.offerPrice) / form.price) * 100)}% discount applied
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9A7A50" }}>Description
                <span className="ml-1.5 normal-case font-normal" style={{ color: "#B0A080" }}>(one point per line)</span>
              </label>
              <textarea
                rows={4}
                className={`${inputCls} resize-none`}
                style={{ ...inputStyle, lineHeight: 1.6 }}
                value={form.description}
                onChange={set("description")}
                onFocus={focusInput}
                onBlur={blurInput}
                placeholder="Add description points, one per line…"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose}
                className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "#EDE4CE", color: "#7A5A3A", border: "1.5px solid #D8C9A8" }}
                onMouseEnter={e => e.currentTarget.style.background = "#E0D0B0"}
                onMouseLeave={e => e.currentTarget.style.background = "#EDE4CE"}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{ background: saving ? "#B07060" : "#8B3A2A", color: "#FAF0DC", opacity: saving ? 0.8 : 1 }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#7A2E1E"; }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#8B3A2A"; }}>
                {saving ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><Check size={14} strokeWidth={2.5} /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Main Component ─────────────────────────────────────────────────────── */
const ProductList = () => {
  const { products, setProducts } = useAppContext();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const toggleStock = async (id, currentStock) => {
    const { data } = await axios.post("/product/stock", { id, inStock: !currentStock });
    if (data.success) {
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, inStock: !p.inStock } : p));
    } else {
      toast.error(data.message);
    }
  };

  const deleteProduct = async (id) => {
    const { data } = await axios.post("/product/delete", { id });
    if (data.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const handleSave = (updated) => {
    setProducts((prev) => prev.map((p) => p._id === updated._id ? updated : p));
  };

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchStock = stockFilter === "All" || (stockFilter === "In Stock" ? p.inStock : !p.inStock);
      return matchSearch && matchCategory && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "price_asc") return a.offerPrice - b.offerPrice;
      if (sortBy === "price_desc") return b.offerPrice - a.offerPrice;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const discount = (p) => p.price && p.offerPrice ? Math.round(((p.price - p.offerPrice) / p.price) * 100) : null;

  const inputStyle = { background: "#FDF7EC", border: "1.5px solid #D9C9A8", color: "#1E1008", fontFamily: "'DM Sans', sans-serif" };
  const focusInput = (e) => { e.target.style.borderColor = "#8B3A2A"; e.target.style.boxShadow = "0 0 0 3px #8B3A2A18"; };
  const blurInput  = (e) => { e.target.style.borderColor = "#D9C9A8"; e.target.style.boxShadow = "none"; };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: "#F5EDD8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9A8060" }}>Seller Dashboard</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Lora', serif", color: "#1E1008", letterSpacing: "-0.3px" }}>Product List</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold self-start sm:self-auto"
          style={{ background: "#EDE4CE", color: "#6B5140", border: "1px solid #D9C9A8" }}>
          <Package size={14} strokeWidth={2} />
          {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 mb-5 flex flex-col md:flex-row gap-3"
        style={{ background: "#FEFAF2", border: "1px solid #E0D2B4", boxShadow: "0 2px 0 #C8920A18, 0 4px 16px #1E100808" }}>
        <div className="relative flex-1">
          <Search size={15} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9A8060" }} />
          <input type="text" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150"
            style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { icon: <Filter size={13} strokeWidth={1.8} />, value: categoryFilter, onChange: setCategoryFilter, options: categories },
            { icon: <Tag size={13} strokeWidth={1.8} />, value: stockFilter, onChange: setStockFilter, options: ["All", "In Stock", "Out of Stock"] },
          ].map((sel, i) => (
            <div key={i} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9A8060" }}>{sel.icon}</div>
              <select value={sel.value} onChange={(e) => sel.onChange(e.target.value)}
                className="pl-8 pr-6 py-2.5 text-sm rounded-xl outline-none appearance-none cursor-pointer transition-all duration-150"
                style={inputStyle} onFocus={focusInput} onBlur={blurInput}>
                {sel.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="relative">
            <ArrowUpDown size={13} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9A8060" }} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-6 py-2.5 text-sm rounded-xl outline-none appearance-none cursor-pointer transition-all duration-150"
              style={inputStyle} onFocus={focusInput} onBlur={blurInput}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-3xl"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#EDE4CE" }}>
            <Package size={24} strokeWidth={1.5} style={{ color: "#9A8060" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#9A8060" }}>No products found</p>
        </div>
      )}

      {/* ── Desktop Table ── */}
      {filtered.length > 0 && (
        <div className="hidden md:block rounded-3xl overflow-hidden mb-5"
          style={{ background: "#FEFAF2", border: "1px solid #E0D2B4", boxShadow: "0 2px 0 #C8920A18, 0 8px 28px #1E100810" }}>
          <div className="grid items-center px-5 py-3 text-xs font-semibold uppercase"
            style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1.2fr 1fr", color: "#9A8060",
              letterSpacing: "0.08em", borderBottom: "1px solid #E0D2B4", background: "#F5EDD8" }}>
            <span>Product</span><span>Category</span><span>MRP</span>
            <span>Offer Price</span><span>Stock Status</span><span className="text-center">Actions</span>
          </div>

          {filtered.map((product, i) => {
            const disc = discount(product);
            return (
              <div key={product._id}
                className="grid items-center px-5 py-4 transition-all duration-150"
                style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1.2fr 1fr", borderBottom: i < filtered.length - 1 ? "1px solid #EDE4CE" : "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAF5EC"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>

                {/* Product */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #E0D2B4" }}>
                    <img src={product.image?.[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1E1008" }}>{product.name}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#9A8060" }}>
                      {Array.isArray(product.description) ? product.description[0] : product.description}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs font-medium px-2.5 py-1 rounded-full w-fit" style={{ background: "#EDE4CE", color: "#6B5140" }}>
                  {product.category}
                </span>

                {/* MRP */}
                <div className={`flex items-center gap-0.5 text-sm ${product.offerPrice ? "line-through" : ""}`}
                  style={{ color: product.offerPrice ? "#9A8060" : "#1E1008" }}>
                  <IndianRupee size={13} strokeWidth={2} />{product.price}
                </div>

                {/* Offer Price */}
                <div>
                  <div className="flex items-center gap-0.5 text-sm font-semibold" style={{ color: product.offerPrice ? "#1E1008" : "#9A8060" }}>
                    <IndianRupee size={13} strokeWidth={2} />{product.offerPrice || 0}
                  </div>
                  {disc > 0 && <span className="text-xs font-semibold" style={{ color: "#6A8B3A" }}>{disc}% off</span>}
                </div>

                {/* Stock */}
                <button onClick={() => toggleStock(product._id, product.inStock)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 w-fit"
                  style={{
                    background: product.inStock ? "#6A8B3A15" : "#8B3A2A15",
                    border: `1.5px solid ${product.inStock ? "#6A8B3A40" : "#8B3A2A40"}`,
                    color: product.inStock ? "#6A8B3A" : "#8B3A2A", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  {product.inStock ? <><ToggleRight size={16} strokeWidth={2} /> In Stock</> : <><ToggleLeft size={16} strokeWidth={2} /> Out of Stock</>}
                </button>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setEditingProduct(product)} title="Edit product"
                    className="w-8 h-8 cursor-pointer rounded-xl flex items-center justify-center transition-all duration-150"
                    style={{ background: "#4A7CC712", color: "#4A7CC7" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#4A7CC725"; e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#4A7CC712"; e.currentTarget.style.transform = "scale(1)"; }}>
                    <Pencil size={13} strokeWidth={1.8} />
                  </button>
                  <button onClick={() => deleteProduct(product._id)} title="Delete product"
                    className="w-8 h-8 cursor-pointer rounded-xl flex items-center justify-center transition-all duration-150"
                    style={{ background: "#8B3A2A12", color: "#8B3A2A" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#8B3A2A25"; e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#8B3A2A12"; e.currentTarget.style.transform = "scale(1)"; }}>
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Mobile Cards ── */}
      {filtered.length > 0 && (
        <div className="flex md:hidden flex-col gap-3 mb-5">
          {filtered.map((product) => {
            const disc = discount(product);
            return (
              <div key={product._id} className="rounded-2xl p-4"
                style={{ background: "#FEFAF2", border: "1px solid #E0D2B4", boxShadow: "0 2px 0 #C8920A18, 0 4px 16px #1E100808" }}>
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #E0D2B4" }}>
                    <img src={product.image?.[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight" style={{ color: "#1E1008", fontFamily: "'Lora', serif" }}>{product.name}</p>
                      {/* Mobile action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => setEditingProduct(product)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                          style={{ background: "#4A7CC712", color: "#4A7CC7" }}>
                          <Pencil size={12} strokeWidth={1.8} />
                        </button>
                        <button onClick={() => deleteProduct(product._id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                          style={{ background: "#8B3A2A12", color: "#8B3A2A" }}>
                          <Trash2 size={13} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1" style={{ background: "#EDE4CE", color: "#6B5140" }}>
                      {product.category}
                    </span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-0.5 font-semibold text-sm" style={{ color: "#1E1008" }}>
                        <IndianRupee size={12} strokeWidth={2} />{product.offerPrice}
                      </div>
                      <div className="flex items-center gap-0.5 text-xs line-through" style={{ color: "#9A8060" }}>
                        <IndianRupee size={11} strokeWidth={2} />{product.price}
                      </div>
                      {disc > 0 && <span className="text-xs font-semibold" style={{ color: "#6A8B3A" }}>{disc}% off</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => toggleStock(product._id, product.inStock)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: product.inStock ? "#6A8B3A15" : "#8B3A2A15",
                    border: `1.5px solid ${product.inStock ? "#6A8B3A40" : "#8B3A2A40"}`,
                    color: product.inStock ? "#6A8B3A" : "#8B3A2A", cursor: "pointer",
                  }}>
                  {product.inStock ? <><ToggleRight size={17} strokeWidth={2} /> In Stock</> : <><ToggleLeft size={17} strokeWidth={2} /> Out of Stock</>}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 px-2 mt-4">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #C8920A55, transparent)" }} />
        <span className="text-xs" style={{ color: "#B8A48A" }}>bazaar</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #C8920A55, transparent)" }} />
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductList;