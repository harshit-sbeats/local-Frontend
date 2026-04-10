import React, { useState } from "react";

const InlineEditableNumber = ({
  value,
  onChange,
  format = "currency", // "currency" | "number" | "percent"
  prefix = "$",
  precision = 2,
  style = {},
  className = "",
}) => {
  const [editing, setEditing] = useState(false);

  const formatValue = () => {
    if (value === null || value === undefined) return "";
    const num = Number(value) || 0;

    // Use Intl.NumberFormat for professional comma-separated display
    if (format === "currency") {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(num);
    }

    if (format === "percent") {
      return new Intl.NumberFormat('en-AU', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(num) + "%";
    }

    // Default number format with commas
    return new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(num);
  };

  return editing ? (
    <input
      type="number"
      className={`form-control form-control-sm ${className}`}
      autoFocus
      step="any"
      value={value}
      style={{ ...style }}
      onFocus={(e) => e.target.select()}  
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? 0 : Number(val));
      }}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter") setEditing(false);
      }}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      style={{
        borderBottom: "1px dashed #888",
        cursor: "pointer",
        ...style,
        width: "fit-content",
        display: "inline-block",
        textAlign: "right" // Better for financial numbers
      }}
      className={className}
    >
      {formatValue()}
    </span>
  );
};

export default InlineEditableNumber;