import React, { useState } from "react";

import SimpleSelectField from "../../Components/SimpleComponents";
const InventoryStatus = ({ data = {}, setData }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white">
      <div className="row">
        {/* We can keep this in a single column or split it, 
            but for consistency with the screenshot, a single column works well. */}
        <div className="col-md-6">
          <SimpleSelectField 
            label="Stock Status" 
            name="stock_status" 
            options={[{"id":1, "value":"In Stock"}, {"id":2, "value":"Out of Stock"}, {"id":3, "value":"Backorder"},{"id":4, "value":"Discontinued"}]} 
            value={data.stock_status} 
            onChange={handleChange}
             labelKey="value"
            valueKey="id"
          />
          <SimpleSelectField 
            label="Status" 
            name="status" 
            options={[{"id":1,"value": "Active"}, 
              {"id":2,"value":"Draft"}, {"id":3,"value":"Discontinued"}, {"id":4,"value":"Archived"}]} 
            value={data.status} 
            onChange={handleChange}
             labelKey="value"
            valueKey="id"
          />
          <SimpleSelectField 
            label="Publish" 
            name="publish_status" 
             options={[{"id":1,"value": "Yes"}, 
              {"id":0,"value":"No"}]} 
            value={data.publish_status} 
            onChange={handleChange}
             labelKey="value"
            valueKey="id"
          />
        </div>
      </div>

      
    </div>
  );
};

export default InventoryStatus;