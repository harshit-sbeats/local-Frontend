import React, { useState } from "react";

/**
 * Reusable components defined outside to maintain focus
 */
import SimpleSelectField, { SimpleInputField } from "../../Components/SimpleComponents";

const AmazonIdentifiers = ({ data = {}, setData }) => {

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
        {/* Column 1 */}
        <div className="col-md-6">
          <SimpleInputField 
            label="ASIN" 
            name="asin" 
            placeholder="Enter ASIN" 
            value={data.asin} 
            onChange={handleChange} 
          />
          <SimpleInputField 
            label="FNSKU" 
            name="fnsku" 
            placeholder="Enter FNSKU" 
            value={data.fnsku} 
            onChange={handleChange} 
          />
          <SimpleInputField 
            label="FBA SKU" 
            name="fba_sku" 
            placeholder="Enter FBA SKU" 
            value={data.fba_sku} 
            onChange={handleChange} 
          />
          
          {/* FBA Checkbox */}
          <div className="mb-3 mt-4">
            <div className="form-check icheck-primary">
              <input 
                className="form-check-input" 
                type="checkbox" 
                name="is_fba" 
                id="fbaCheck"
                checked={data.is_fba}
                onChange={handleChange}
              />
              <label className="form-check-label  fw-bold" htmlFor="fbaCheck">
                FBA
              </label>
            </div>
          </div> 
        </div>

        {/* Column 2 */}
       
        <div className="col-md-6">

          <SimpleSelectField 
            label="Amazon Size" 
            name="amazon_size" 
            options={[{ id: "small", value: "Small" },
            { id: "medium", value: "Medium" },
            { id: "large", value: "Large" },
            { id: "oversize", value: "Oversize" },
            ]}
            value={data.amazon_size} 
            onChange={handleChange}
            labelKey="value"
            valueKey="id"
          />
          <SimpleSelectField 
            label="Barcode Label Type" 
            name="barcode_label_type" 
            options={[{ id: "manufacturer", value: "Manufacturer Barcode" },
            { id: "amazon_barcode", value: "Amazon Barcode" },
            ]}
            value={data.barcode_label_type} 
            onChange={handleChange}
            labelKey="value"
            valueKey="id"
          />
          <SimpleSelectField 
            label="Prep Type" 
            name="prep_type" 
            options={[{ id: "no_prep_needed", value: "No Prep Needed" },
            { id: "polybag", value: "Polybagging" },
          { id: "bubble_wrap", value: "Bubble Wrap" },
        { id: "labeling", value: "Labeling" },
       ]}
            value={data.prep_type} 
            onChange={handleChange}
            labelKey="value"
            valueKey="id"
          />
        </div>
      </div>

    
    </div>
  );
};

export default AmazonIdentifiers;