import React from "react";
import useMasterData from "../../Context/MasterDataProvider";

const SimpleInputField = ({ label, name, className, placeholder, value, onChange }) => (
  <div className={`mb-3 ${className}`}>
    <label className="form-label fw-bold small mb-1">{label}</label>
    <input
      type="text"
      name={name}
      className="form-control form-control-sm"
      placeholder={placeholder}
      // 🔹 Use ?? to allow 0 to be displayed
      value={value ?? ""} 
      onChange={onChange}
    />
  </div>
);

const PriceDetails = ({ data = {}, setData }) => {
  const { vendors = [] } = useMasterData();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 🔹 If it's a checkbox, use 'checked'. Otherwise use 'value'.
    const finalValue = type === "checkbox" ? checked : value;

    setData((prev) => ({
      ...prev,
      [name]: finalValue
    }));
  };

  return (
    <div className="bg-white">
      <div className="row">
        <div className="col-md-6">
          <div className="mt-3 mb-3 pb-2">
            <div className="form-check icheck-primary d-inline">
              <input  
                className="form-check-input" 
                type="checkbox" 
                name="is_taxable" 
                id="is_taxable" 
                // 🔹 Explicitly handle boolean
                checked={!!data.is_taxable} 
                onChange={handleChange}
              />
              <label className="form-check-label fw-bold" htmlFor="is_taxable">
                Taxable Product
              </label>
            </div>
          </div>

          <SimpleInputField className="mt-4" label="Sales Price" name="sale_price" value={data.sale_price} onChange={handleChange} />
          <SimpleInputField label="Retail Price" name="retail_price" value={data.retail_price} onChange={handleChange} />
          <SimpleInputField label="Cost Per Item Price" name="cost_per_item" value={data.cost_per_item} onChange={handleChange} />
          <SimpleInputField label="Product Margin %" name="margin_percent" value={data.margin_percent} onChange={handleChange} />
          <SimpleInputField label="Profit" name="profit" value={data.profit} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <SimpleInputField label="Minimum Price" name="min_price" value={data.min_price} onChange={handleChange} />
          <SimpleInputField label="Maximum Price" name="max_price" value={data.max_price} onChange={handleChange} />
          <SimpleInputField label="Estimated Shipping Cost" name="estimated_shipping_cost" value={data.estimated_shipping_cost} onChange={handleChange} />
          
          <div className="mb-3">
            <label className="form-label fw-bold small mb-1">Preferred Vendor</label>
            <select 
              className="form-select form-select-sm" 
              name="preferred_vendor" 
              // 🔹 Allows vendor ID 0 to stay selected
              value={data.preferred_vendor ?? ""} 
              onChange={handleChange}
            >
              <option value="">Select vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          
          <SimpleInputField label="Vendor SKU" name="vendor_sku" value={data.vendor_sku} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;