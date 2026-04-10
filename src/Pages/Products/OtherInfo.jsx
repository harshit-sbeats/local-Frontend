import React, { useState, useEffect } from "react";

/**
 * Classic input field (same style)
 */
const ClassicField = ({ label, name, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <input
      type="number"
      name={name}
      className="form-control form-control-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const OtherInfo = ({ data = {}, setData }) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // -----------------------------
  // Sync tags from parent (edit)
  // -----------------------------
  useEffect(() => {
  const rawTags = data.product_tags;

  if (Array.isArray(rawTags)) {
    setTags(rawTags);
  } else if (typeof rawTags === "string" && rawTags.trim()) {
    try {
      const parsed = JSON.parse(rawTags.replace(/'/g, '"'));
      setTags(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setTags([]);
    }
  } else {
    setTags([]);
  }
}, [data.product_tags]);

  // -----------------------------
  // Generic onChange (LIKE ProductAttributes)
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // -----------------------------
  // Add tag
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const value = inputValue.trim().replace(/,/g, "");
      if (!value || tags.includes(value)) return;

      const updatedTags = [...tags, value];
      setTags(updatedTags);
      setInputValue("");

      setData((prev) => ({
        ...prev,
        product_tags: updatedTags
      }));
    }
  };

  // -----------------------------
  // Remove tag
  // -----------------------------
  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);

    setData((prev) => ({
      ...prev,
      product_tags: updatedTags
    }));
  };

  return (
    <div className="bg-white">
      <div className="row">
        <div className="col-md-8">

          {/* ===============================
              Warranty
          =============================== */}
          <ClassicField
            label="Warranty (months)"
            name="warranty"
            placeholder="Enter warranty in months"
            value={data?.warranty}
            onChange={handleChange}
          />

          {/* ===============================
              Product Tags
          =============================== */}
          <div className="mb-3">
            <label className="form-label fw-bold small mb-1">
              Product Tags
            </label>

            <div
              className="form-control form-control-sm d-flex flex-wrap align-items-center gap-1"
              style={{ minHeight: "38px", cursor: "text" }}
              onClick={() => document.getElementById("tag-input").focus()}
            >
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border d-flex align-items-center gap-1"
                  style={{ fontSize: "0.85rem", fontWeight: "normal" }}
                >
                  {tag}
                  <i
                    className="fas fa-times-circle text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeTag(index)}
                  />
                </span>
              ))}

              <input
                id="tag-input"
                type="text"
                className="border-0 flex-grow-1 shadow-none"
                style={{
                  outline: "none",
                  fontSize: "0.875rem",
                  minWidth: "120px"
                }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
              />
            </div>

            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Press Enter or Comma to add a tag.
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OtherInfo;
