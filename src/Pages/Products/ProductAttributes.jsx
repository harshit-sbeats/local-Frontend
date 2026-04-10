import React from "react";

import { ClassicField } from "../../Components/SimpleComponents";

// data matrum setData-vai parent-la irunthu vanganum
const ProductAttributes = ({ data, setData }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Direct-ah parent state-oda attributes-ai update pannum
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white">
      <div className="row">
        <div className="col-md-6">
          <ClassicField 
            label="Colour" 
            name="color" 
            placeholder="Enter Color" 
            value={data?.color} 
            onChange={handleChange} 
          />
          <ClassicField 
            label="Size" 
            name="size" 
            placeholder="Enter Size" 
            value={data?.size} 
            onChange={handleChange} 
          />
          <ClassicField 
            label="Material" 
            name="material" 
            placeholder="Enter Material" 
            value={data?.material} 
            onChange={handleChange} 
          />
          <ClassicField 
            label="Compatibility" 
            name="compatibility" 
            placeholder="Enter Compatibility" 
            value={data?.compatibility} 
            onChange={handleChange} 
          />
        </div>

        <div className="col-md-6">
          <ClassicField 
            label="Height (cm)" 
            type="number"
            name="height"  
            placeholder="Enter Height" 
            value={data?.height} 
            onChange={handleChange} 
          />
          <ClassicField 
            label="Width (cm)" 
            name="width"  type="number" 
            placeholder="Enter Width" 
            value={data?.width} 
            onChange={handleChange} 
          />
          <ClassicField 
            label="Depth (cm)" 
            name="depth"  type="number" 
            placeholder="Enter Depth" 
            value={data?.depth} 
            onChange={handleChange} 
          />
          <ClassicField 
            label="Weight (kg)" 
            name="weight"  type="number" 
            placeholder="Enter Weight" 
            value={data?.weight} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductAttributes;