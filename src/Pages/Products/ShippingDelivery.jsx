import React, { useState } from "react";

/**
 * Reusable components defined outside to ensure cursor focus is not lost
 */
const SimpleInputField = ({ label, name, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <input
      type="text"
      name={name}
      className="form-control form-control-sm shadow-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SimpleSelectField = ({ 
  label, name, options, value, onChange, showAddButton, 
  valueKey = "id", labelKey = "name", disabled 
}) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <div className="input-group input-group-sm">
      <select 
        className="form-select form-select-sm" 
        name={name} 
        value={value ?? ""} 
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{disabled ? 'Loading...' : `Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
          </option>
        ))}
      </select>
      {showAddButton && (
        <button className="btn btn-outline-secondary" type="button">
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  </div>
);

const ShippingDelivery = ({ data = {}, setData }) => {

   const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  return (
    <div className="bg-white">
      <div className="row">
        <div className="col-md-8">
          {/* Dropdown Fields */}
          <SimpleSelectField 
            label="Fast Dispatch" 
            name="fast_dispatch" 
            value={data.fast_dispatch} 
            onChange={handleChange} 


             options={[{ id: 1, value: "Yes" },
            { id: 0, value: "No" }
            ]}
            labelKey="value"
            valueKey="id"

          />
          
          <SimpleSelectField 
            label="Free Shipping" 
            name="free_shipping" 
            value={data.free_shipping} 
            onChange={handleChange} 
            options={[{ id: 1, value: "Yes" },
            { id: 0, value: "No" }
            ]}
            labelKey="value"
            valueKey="id"
          />
          <SimpleSelectField 
            label="Is the product bulky?" 
            name="bulky_product" 
            value={data.bulky_product} 
            onChange={handleChange} 
            options={[{ id: 1, value: "Yes" },
            { id: 0, value: "No" }
            ]}
            labelKey="value"
            valueKey="id" 
          />

          {/* Text Input Fields */}
          <SimpleInputField 
            label="International Note" 
            name="international_note" 
            placeholder="Enter note" 
            value={data.international_note} 
            onChange={handleChange} 
          />
          <SimpleInputField 
            label="Example Reference" 
            name="example_reference" 
            placeholder="Enter reference" 
            value={data.example_reference} 
            onChange={handleChange} 
          />
          <SimpleInputField 
            label="Ships from" 
            name="ships_from" 
            placeholder="Enter location" 
            value={data.ships_from} 
            onChange={handleChange} 
          />
          <SimpleInputField 
            label="Handling Time (days)" 
            name="handling_time_days" 
            placeholder="Enter days" 
            value={data.handling_time_days} 
            onChange={handleChange} 
          />
          <SimpleInputField 
            label="SBAU" 
            name="sbau" 
            placeholder="Enter SBAU" 
            value={data.sbau} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;