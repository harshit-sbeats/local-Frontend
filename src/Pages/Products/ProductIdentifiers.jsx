import React, { useState, useEffect, useCallback } from "react";
import { useMasterData } from "../../Context/MasterDataProvider";
import { API_BASE } from "../../Config/api";
import { apiFetch } from "../../Utils/apiFetch";
import { toast } from "react-hot-toast";

/**
 * HELPER COMPONENTS
 */
const SimpleInputField = ({ label, name, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <input
      type="text"
      name={name}
      className="form-control form-control-sm"
      placeholder={placeholder}
      value={value || ""} // Ensure it's never undefined
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
        value={value || ""} 
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

const ProductIdentifiers = ({ data = {}, setData }) => {
  const [manufacturers, setManufacturers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { countries } = useMasterData();

  useEffect(() => {
    let isMounted = true;

    const fetchMasterData = async () => {
      try {
        const [brandsRes, manufacturersRes] = await Promise.all([
          apiFetch(`${API_BASE}api/product_api/product_brands/all`),
          apiFetch(`${API_BASE}api/product_api/product_manufacturers/all`)
        ]);

        if (isMounted) {
          if (brandsRes.status) setBrands(brandsRes.data || []);
          if (manufacturersRes.status) setManufacturers(manufacturersRes.data || []);
        }
      } catch (error) {
        console.error("Master data fetch error:", error);
        toast.error("Failed to load brands or manufacturers");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMasterData();
    return () => { isMounted = false; }; // Cleanup to prevent state updates on unmounted component
  }, []);

  // Use callback for performance if this were passed deeper
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const CONDITION_OPTIONS = [
    { id: "new", value: "New" },
    { id: "used", value: "Used" },
    { id: "refurbished", value: "Refurbished" },
    { id: "open_box", value: "Open Box" }
  ];

  return (
    <div className="bg-white p-2">
      <div className="row">
        {/* Column 1 */}
        <div className="col-md-6">
          <SimpleSelectField 
            label="Brand" 
            name="brand_id" 
            options={brands} 
            value={data.brand_id} 
            onChange={handleChange}
            valueKey="brand_id" 
            disabled={loading}
          />
          <SimpleSelectField 
            label="Manufacturer" 
            name="manufacturer_id" 
            options={manufacturers} 
            value={data.manufacturer_id} 
            onChange={handleChange}
            valueKey="manufacturer_id"
            disabled={loading}
          />
          <SimpleInputField label="EAN" name="ean" value={data.ean} onChange={handleChange} />
          <SimpleInputField label="UPC" name="upc" value={data.upc} onChange={handleChange} />
        </div>

        {/* Column 2 */}
        <div className="col-md-6">
          <SimpleInputField label="ISBN" name="isbn" value={data.isbn} onChange={handleChange} />
          <SimpleInputField label="MPN" name="mpn" value={data.mpn} onChange={handleChange} />
          <SimpleSelectField 
            label="Country of Origin" 
            name="country_id" 
            options={countries || []} 
            value={data.country_id} 
            onChange={handleChange}
            labelKey="text"
          />
          <SimpleSelectField 
            label="Condition" 
            name="status_condition" 
            options={CONDITION_OPTIONS} 
            value={data.status_condition} 
            onChange={handleChange}
            labelKey="value"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductIdentifiers;