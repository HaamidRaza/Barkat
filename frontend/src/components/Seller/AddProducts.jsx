import React, { useState } from "react";
import {
  Upload,
  X,
  Package,
  Tag,
  DollarSign,
  FileText,
  Grid3X3,
  ImagePlus,
  Percent,
  ChevronDown,
  IndianRupee,
} from "lucide-react";
import axios from "../../config/api.js";
import toast from "react-hot-toast";
import { sellerCategories } from "../../assets/assets.js";

const AddProducts = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [descRows, setDescRows] = useState([{ label: "", value: "" }]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showDescPaste, setShowDescPaste] = useState(false);
  const [descPasteText, setDescPasteText] = useState("");

  const categories = sellerCategories;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const mapped = selected.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 6));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const mapped = dropped.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 6));
  };

  const removeFile = (idx) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const productData = {
      name,
      description: descRows
        .filter((r) => r.label.trim() && r.value.trim())
        .flatMap((r) => [r.label.trim(), r.value.trim(), ""]),
      category,
      price,
      offerPrice,
    };

    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i].file);
    }

    try {
      await toast.promise(
        axios.post("/product/add", formData),
        {
          loading: "Uploading product...",
          success: (response) => {
            const { data } = response;
            if (data.success) {
              setName("");
              setDescRows([{ label: "", value: "" }]);
              setCategory("");
              setPrice("");
              setOfferPrice("");
              setFiles([]);
              return data.message || "Product added successfully!";
            } else {
              throw new Error(data.message || "Failed to add product");
            }
          },
          error: (err) => {
            return err.response?.data?.message || err.message || "Failed to upload product";
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const parseDescPaste = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const rows = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.replace(/^[\*\-•·]\s*/, "").trim();

      // Try inline separators first
      const separators = [" – ", " — ", " - ", ": ", " : "];
      let matched = false;
      for (const sep of separators) {
        const idx = line.indexOf(sep);
        if (idx !== -1) {
          rows.push({
            label: line.substring(0, idx).trim(),
            value: line.substring(idx + sep.length).trim(),
          });
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Alternating lines mode — this line is a label, next line is the value
        const nextLine = lines[i + 1];
        if (nextLine !== undefined) {
          // Check next line isn't itself a label (i.e. no separator and short-ish)
          const nextHasSeparator = separators.some((sep) =>
            nextLine.includes(sep),
          );
          if (!nextHasSeparator) {
            rows.push({
              label: line,
              value: nextLine.trim(),
            });
            i++; // skip next line since we consumed it as a value
            continue;
          }
        }
        // No next line or next line looks like a label — skip
      }
    }

    return rows.filter((r) => r.label && r.value);
  };
  const discount =
    price && offerPrice
      ? Math.round(
          ((parseFloat(price) - parseFloat(offerPrice)) / parseFloat(price)) *
            100,
        )
      : null;

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        backgroundColor: "#F5EDD8",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Page Header */}
      <div className="mb-6">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "#9A8060" }}
        >
          Seller Dashboard
        </p>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "'Lora', serif",
            color: "#1E1008",
            letterSpacing: "-0.3px",
          }}
        >
          Add New Product
        </h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Basic Info Card */}
            <div
              className="rounded-3xl p-5 md:p-6"
              style={{
                background: "#FEFAF2",
                border: "1px solid #E0D2B4",
                boxShadow: "0 2px 0 #C8920A18, 0 8px 28px #1E100810",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#8B3A2A12" }}
                >
                  <Package
                    size={15}
                    strokeWidth={1.8}
                    style={{ color: "#8B3A2A" }}
                  />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
                >
                  Basic Information
                </h2>
              </div>

              {/* Product Name */}
              <div className="mb-4">
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: "#9A8060" }}
                >
                  Product Name
                </label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9A8060" }}
                  >
                    <Package size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted Ceramic Mug"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150 focus:ring-2"
                    style={{
                      background: "#FDF7EC",
                      border: "1.5px solid #D9C9A8",
                      color: "#1E1008",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8B3A2A";
                      e.target.style.boxShadow = "0 0 0 3px #8B3A2A18";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D9C9A8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#9A8060" }}
                  >
                    Product Details
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDescPaste((p) => !p)}
                    className="text-xs px-3 py-1 cursor-pointer rounded-full transition-all"
                    style={{ background: "#EDE4CE", color: "#6B5140" }}
                  >
                    {showDescPaste ? "← Manual" : "Paste a list"}
                  </button>
                </div>

                {showDescPaste ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none"
                      style={{
                        background: "#FDF7EC",
                        border: "1.5px solid #D9C9A8",
                        color: "#1E1008",
                        fontFamily: "'DM Sans', sans-serif",
                        minHeight: 140,
                      }}
                      placeholder={
                        "Paste product details, one per line:\nBrand – Raw Pressery\nWeight – 500g\nStorage – Keep refrigerated\nDietary – Vegan"
                      }
                      rows={6}
                      value={descPasteText}
                      onChange={(e) => setDescPasteText(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8B3A2A";
                        e.target.style.boxShadow = "0 0 0 3px #8B3A2A18";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#D9C9A8";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseDescPaste(descPasteText);
                        if (!parsed.length) {
                          toast.error(
                            "Couldn't parse any rows — use 'Label – Value' format",
                          );
                          return;
                        }
                        setDescRows(parsed);
                        setShowDescPaste(false);
                        setDescPasteText("");
                        toast.success(`${parsed.length} rows added!`);
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: "#8B3A2A", color: "#FFECD0" }}
                    >
                      Parse & add{" "}
                      {descPasteText
                        ? `(${parseDescPaste(descPasteText).length} detected)`
                        : ""}
                    </button>
                    <p className="text-xs" style={{ color: "#B8A48A" }}>
                      Supports: Label – Value · Label: Value · Label — Value
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      {descRows.map((row, i) => (
                        <div
                          key={i}
                          className="flex flex-col md:flex-row gap-2 md:items-center"
                        >
                          <input
                            type="text"
                            placeholder="Label (e.g. brand)"
                            value={row.label}
                            onChange={(e) => {
                              const updated = [...descRows];
                              updated[i].label = e.target.value;
                              setDescRows(updated);
                            }}
                            className="flex-1 px-3 py-2 text-sm rounded-xl outline-none"
                            style={{
                              background: "#FDF7EC",
                              border: "1.5px solid #D9C9A8",
                              color: "#1E1008",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#8B3A2A";
                              e.target.style.boxShadow = "0 0 0 3px #8B3A2A18";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#D9C9A8";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. Raw Pressery)"
                            value={row.value}
                            onChange={(e) => {
                              const updated = [...descRows];
                              updated[i].value = e.target.value;
                              setDescRows(updated);
                            }}
                            className="flex-2 px-3 py-2 text-sm rounded-xl outline-none"
                            style={{
                              background: "#FDF7EC",
                              border: "1.5px solid #D9C9A8",
                              color: "#1E1008",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#8B3A2A";
                              e.target.style.boxShadow = "0 0 0 3px #8B3A2A18";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#D9C9A8";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                          {descRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setDescRows((prev) =>
                                  prev.filter((_, idx) => idx !== i),
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
                              style={{
                                background: "#8B3A2A12",
                                color: "#8B3A2A",
                              }}
                            >
                              <X size={13} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setDescRows((prev) => [
                          ...prev,
                          { label: "", value: "" },
                        ])
                      }
                      className="mt-2 cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        color: "#8B3A2A",
                        background: "#8B3A2A10",
                        border: "1px dashed #8B3A2A40",
                      }}
                    >
                      + Add Row
                    </button>

                    <p className="mt-2 text-xs" style={{ color: "#B8A48A" }}>
                      Common labels: brand, weight, ingredients, storage
                      instruction, dietary preference
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Image Upload Card */}
            <div
              className="rounded-3xl p-5 md:p-6"
              style={{
                background: "#FEFAF2",
                border: "1px solid #E0D2B4",
                boxShadow: "0 2px 0 #C8920A18, 0 8px 28px #1E100810",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#C8920A12" }}
                >
                  <ImagePlus
                    size={15}
                    strokeWidth={1.8}
                    style={{ color: "#C8920A" }}
                  />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
                >
                  Product Images
                </h2>
                <span
                  className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "#EDE4CE", color: "#9A8060" }}
                >
                  {files.length}/6
                </span>
              </div>

              {/* Drop zone */}
              {files.length === 6 ? null : (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer transition-all duration-150 py-8 px-4 mb-4"
                  style={{
                    border: `2px dashed ${dragOver ? "#8B3A2A" : "#D9C9A8"}`,
                    background: dragOver ? "#8B3A2A08" : "#FDF7EC",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "#EDE4CE" }}
                  >
                    <Upload
                      size={18}
                      strokeWidth={1.8}
                      style={{ color: "#8B3A2A" }}
                    />
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#6B5140" }}
                  >
                    Drop images here or{" "}
                    <span style={{ color: "#8B3A2A" }}>browse</span>
                  </p>
                  <p className="text-xs" style={{ color: "#B8A48A" }}>
                    PNG, JPG, WEBP · Max 6 images
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}

              {/* Previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden aspect-square"
                      style={{ border: "1.5px solid #E0D2B4" }}
                    >
                      <img
                        src={f.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 cursor-pointer rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        style={{ background: "#8B3A2A", color: "#fff" }}
                      >
                        <X size={10} strokeWidth={2.5} />
                      </button>
                      {i === 0 && (
                        <span
                          className="absolute bottom-1 left-1 text-xs font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: "#C8920A",
                            color: "#fff",
                            fontSize: 9,
                          }}
                        >
                          MAIN
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Category Card */}
            <div
              className="rounded-3xl p-5"
              style={{
                background: "#FEFAF2",
                border: "1px solid #E0D2B4",
                boxShadow: "0 2px 0 #C8920A18, 0 8px 28px #1E100810",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#6A8B3A12" }}
                >
                  <Grid3X3
                    size={15}
                    strokeWidth={1.8}
                    style={{ color: "#6A8B3A" }}
                  />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
                >
                  Category
                </h2>
              </div>

              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: "#9A8060" }}
              >
                Select Category
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#9A8060" }}
                >
                  <Tag size={15} strokeWidth={1.8} />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full cursor-pointer pl-9 pr-8 py-2.5 text-sm rounded-xl outline-none appearance-none transition-all duration-150"
                  style={{
                    background: "#FDF7EC",
                    border: "1.5px solid #D9C9A8",
                    color: category ? "#1E1008" : "#B8A48A",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8B3A2A";
                    e.target.style.boxShadow = "0 0 0 3px #8B3A2A18";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9C9A8";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#9A8060" }}
                >
                  <ChevronDown size={14} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div
              className="rounded-3xl p-5"
              style={{
                background: "#FEFAF2",
                border: "1px solid #E0D2B4",
                boxShadow: "0 2px 0 #C8920A18, 0 8px 28px #1E100810",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#8B3A2A12" }}
                >
                  <DollarSign
                    size={15}
                    strokeWidth={1.8}
                    style={{ color: "#8B3A2A" }}
                  />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Lora', serif", color: "#1E1008" }}
                >
                  Pricing
                </h2>
              </div>

              {/* MRP */}
              <div className="mb-3">
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: "#9A8060" }}
                >
                  MRP / Original Price
                </label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9A8060" }}
                  >
                    <IndianRupee size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150"
                    style={{
                      background: "#FDF7EC",
                      border: "1.5px solid #D9C9A8",
                      color: "#1E1008",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8B3A2A";
                      e.target.style.boxShadow = "0 0 0 3px #8B3A2A18";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D9C9A8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Offer Price */}
              <div className="mb-3">
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: "#9A8060" }}
                >
                  Offer / Sale Price
                </label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#6A8B3A" }}
                  >
                    <IndianRupee size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150"
                    style={{
                      background: "#FDF7EC",
                      border: "1.5px solid #D9C9A8",
                      color: "#1E1008",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#6A8B3A";
                      e.target.style.boxShadow = "0 0 0 3px #6A8B3A18";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D9C9A8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Discount badge */}
              {discount !== null && discount > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: "#6A8B3A12",
                    border: "1px solid #6A8B3A30",
                  }}
                >
                  <Percent
                    size={13}
                    strokeWidth={2}
                    style={{ color: "#6A8B3A" }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#6A8B3A" }}
                  >
                    {discount}% discount applied
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 cursor-pointer rounded-2xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #A8442F, #8B3A2A)",
                color: "#FFECD0",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "inset 0 1px 0 #C8603A30, 0 4px 16px #8B3A2A30",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#FFECD055"
                      strokeWidth="3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#FFECD0"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <Upload size={15} strokeWidth={2} />
                  Publish Product
                </>
              )}
            </button>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 px-2">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #C8920A55, transparent)",
                }}
              />
              <span className="text-xs" style={{ color: "#B8A48A" }}>
                bazaar
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #C8920A55, transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
