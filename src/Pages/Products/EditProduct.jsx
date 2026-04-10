import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { apiFetch } from "../../Utils/apiFetch";
import { API_BASE } from "../../Config/api";
import { toast } from "react-hot-toast";

// Sub-components
import ProductAttributes from "./ProductAttributes";
import ProductIdentifiers from "./ProductIdentifiers";
import AmazonIdentifiers from "./AmazonIdentifiers";
import InventoryStatus from "./InventoryStatus";
import PriceDetails from "./PriceDetails";
import ShippingDelivery from "./ShippingDelivery";
import OtherInfo from "./OtherInfo";

const EditProduct = () => {
  const { productId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Attributes");//"Basic Info"
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  const [productData, setProductData] = useState({
    sku: "",
    title: "",
    product_type: "",
    is_alias: false,
    description: "",
    short_description: "",
    attributes: {},
    identifiers: {},
    amazon_identifiers: {},
    inventory: {},
    pricing: {},
    shipping: {},
    other_info: {}
  });

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ 'size': ['14px', false, 'large', 'huge'] }],
      [{ 'color': [] }],
      ["blockquote", "code-block"],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'clean'],
      ['undo', 'redo']
    ],
  };

  const sidebarItems = [
    "Basic Info", "Attributes", "Identifiers", "Amazon Identifiers",
    "Inventory & Status", "Price Details", "Shipping & Delivery", "Other Info"
  ];

  // 1. GET PRODUCT DETAILS API
  useEffect(() => {
    const loadInitialData = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        // 1. Fetch both product details and product types concurrently
        const [detailsRes, typesRes] = await Promise.all([
          apiFetch(`${API_BASE}api/product/details/${productId}/`, { method: "GET" }),
          apiFetch(`${API_BASE}api/product/api/get_all_product_types`, { method: "GET" })
        ]);

        // 2. Handle Product Details response
        if (detailsRes.status) {
          setProductData(detailsRes.data);
        } else {
          toast.error(detailsRes.message || "Failed to load product details");
          navigate("/products");
          return; // Stop if product details fail
        }

        // 3. Handle Product Types response
        if (typesRes.status) {
          setProductTypes(typesRes.data || []);
        } else {
          console.warn("Product types failed to load, using empty list.");
        }

      } catch (error) {
        console.error("Initial data load error:", error);
        toast.error("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [productId, navigate]);

  // 2. HANDLESAVE API (UPDATE)

  const handleSave = async () => {
    console.log(productData.attributes);
    //return;
    setSaveLoading(true);
    try {
      // Use PUT or PATCH for editing an existing resource
      const response = await apiFetch(`${API_BASE}api/product/update/${productId}/`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });

      if (response.status) {
        toast.success("Product updated successfully!");
      } else {
        toast.error(response.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div className="text-center p-5">Loading Product Details...</div>;

  return (
    <div className="container-fluid bg-light min-vh-100 p-0">
      <div className="mx-1 mt-2">
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-white py-2">
            <i className="fas fa-info-circle me-2 text-info"></i>
            <strong>Product Information: {productData.sku}</strong>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-2">
                <label className="form-label mb-0">Product Type</label>
              </div>
              <div className="col-md-6">
                <select 
                  className="form-select mb-3" 
                  name="product_type"
                  value={productData.product_type}
                  onChange={handleInputChange}
                >
                  <option value="">select</option>
                  {productTypes.map((d)=>{
                    return <option value={d.product_type_id} key={d.product_type_id}>{d.type_name}</option>
                  })}
                </select>
                <div className="form-check icheck-primary ">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="aliasProduct"
                    name="is_alias"
                    checked={productData.is_alias}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="aliasProduct">
                    Alias Product
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-2">
            <div className="list-group shadow-sm ">
              {sidebarItems.map((item) => (
                <button
                  key={item}
                  className={`list-group-item list-group-item-action border-0 ${
                    activeTab === item ? "active fw-bold text-white" : ""
                  }`}
                  style={activeTab === item ? { backgroundColor: '#007bff' } : {}}
                  onClick={() => setActiveTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-10">
            <div className="card shadow-sm border-0 min-vh-50">
              <div className="card-header bg-white border-bottom">
                <h6 className="mb-0">{activeTab}</h6>
              </div>
              <div className="card-body">
                {activeTab === "Basic Info" && (
                  <div className="row g-3">
                    <div className="row mb-3 align-items-center">
                      <label className="col-sm-2 col-form-label ">SKU</label>
                      <div className="col-sm-10">
                        <input 
                          type="text" 
                          name="sku"
                          className="form-control form-control-sm" 
                          value={productData.sku}
                          onChange={handleInputChange}
                          disabled // Usually SKU is not editable after creation
                        />
                      </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                      <label className="col-sm-2 col-form-label ">Title</label>
                      <div className="col-sm-10">
                        <input 
                          type="text" 
                          name="title"
                          className="form-control form-control-sm" 
                          value={productData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-4">
                      <label className="col-sm-2 col-form-label  pt-2">Description</label>
                      <div className="col-sm-10">
                        <div className="editor-wrapper shadow-sm">
                          <ReactQuill 
                            theme="snow" 
                            value={productData.description} 
                            onChange={(val) => setProductData(prev => ({ ...prev, description: val }))} 
                            modules={modules}
                            style={{ height: '200px', marginBottom: '45px' }} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <label className="col-sm-2 col-form-label  pt-2">Short Desc</label>
                      <div className="col-sm-10">
                        <div className="editor-wrapper shadow-sm">
                          <ReactQuill 
                            theme="snow" 
                            value={productData.short_description} 
                            onChange={(val) => setProductData(prev => ({ ...prev, short_description: val }))} 
                            modules={modules}
                            style={{ height: '150px', marginBottom: '45px' }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
 
                {/* Other tabs follow the same pattern, passing productData and setProductData as props */}
                {activeTab === "Attributes" && <ProductAttributes 
                  data={productData.attributes} 
                  setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    attributes: typeof valFunc === 'function' ? valFunc(prev.attributes) : valFunc 
                  }))} 
                />}
                
                {activeTab === "Identifiers" && <ProductIdentifiers 
                  data={productData.identifiers} 
                  setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    identifiers: typeof valFunc === 'function' ? valFunc(prev.identifiers) : valFunc 
                  }))}  
                
                />}
                {activeTab === "Amazon Identifiers" && <AmazonIdentifiers data={productData.amazon_identifiers} setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    amazon_identifiers: typeof valFunc === 'function' ? valFunc(prev.amazon_identifiers) : valFunc 
                  }))}  />}
                {activeTab === "Inventory & Status" && <InventoryStatus data={productData.inventory_status} setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    inventory_status: typeof valFunc === 'function' ? valFunc(prev.inventory_status) : valFunc 
                  }))} />}
                {activeTab === "Price Details" && <PriceDetails data={productData.pricing} setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    pricing: typeof valFunc === 'function' ? valFunc(prev.pricing) : valFunc 
                  }))} />}
                {activeTab === "Shipping & Delivery" && <ShippingDelivery data={productData.shipping} setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    shipping: typeof valFunc === 'function' ? valFunc(prev.shipping) : valFunc 
                  }))} />}

                {activeTab === "Other Info" && <OtherInfo data={productData.other_info} setData={(valFunc) => setProductData(prev => ({ 
                    ...prev, 
                    other_info: typeof valFunc === 'function' ? valFunc(prev.other_info) : valFunc 
                  }))}  />}
                
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button 
                className="btn btn-success px-4" 
                onClick={handleSave}
                disabled={saveLoading}
              >
                {saveLoading ? 'Updating...' : <><i className="fas fa-save me-2"></i> Update</>}
              </button>
              <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
                <i className="fas fa-ban me-2"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;