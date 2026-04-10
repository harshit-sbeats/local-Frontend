import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMasterData } from "../../../Context/MasterDataProvider";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_BASE, API_ENDPOINTS } from "../../../Config/api";
import { formattedDate, formatToISODate } from "../../../Utils/utilFunctions";
import { SHIPPING_STATUS } from "../../../Constants/shippingStatus";
import DateInput from "../../Common/DateInput";

const shipping_status_array = [{"id":0, "value":"Shipped"}, {"id":1, "value":"Delivered"}, 
                        {"id":2, "value":"Cancelled"}, {"id":3, "value":"Returned / Refunded"}
                      ];
                      
const ShippingTab = ({ poId, preferredShippingProvider }) => {
  const { shippingProviders } = useMasterData();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingShippingId, setEditingShippingId] = useState(null);

  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    provider: "",
    tracking_number: "",
    shipping_date: today,
    status:null,
    delivery_eta_date: "",
    vendor_po: "",
    vendor_po_order_no: "",
    vendor_po_order_date: "",
    delivery_date: "",
  });

  useEffect(() => {
    if (preferredShippingProvider) {
      setFormData((prev) => ({ ...prev, provider: preferredShippingProvider }));
    }
  }, [preferredShippingProvider, shippingProviders]);

  /* ------------------ API: Load Shipping Data ------------------ */
  const loadData = async () => {
    setLoading(true);
    const shipping_data = await apiFetch(`${API_BASE}api/purchaseorder/api/purchase-order/get_shipping_rows/${poId}`)
    if(shipping_data)
      setLoading(false)
    console.log(shipping_data)
    setProducts(shipping_data?.data);
  };

  useEffect(() => {
    if (poId) loadData();
  }, [poId]);

  useEffect(() => {
    if (!isEditMode && preferredShippingProvider) {
      setFormData((prev) => ({ ...prev, provider: preferredShippingProvider }));
    }
  }, [preferredShippingProvider, isEditMode]);
  /* ------------------ API: Save Shipment ------------------ */
  const handleEditShipment = (ship) => {
    setIsEditMode(true);
    setEditingShippingId(ship.shipping_id);

    // find provider id using carrier_name
    const matchedProvider = shippingProviders.find(
      (p) => p.carrier_name === ship.carrier_name
    );

    setFormData({
      provider: matchedProvider ? String(matchedProvider.carrier_id) : "",
      tracking_number: ship.tracking_number || "",
      shipping_date: ship.shipping_date || today,
      status: ship.status ?? "",
      delivery_eta_date: ship.delivery_eta_date || "",
      vendor_po: ship.vendor_po || "",
      vendor_po_order_no: ship.vendor_po_order_no || "",
      vendor_po_order_date: ship.vendor_po_order_date || "",
      delivery_date: ship.delivery_date || "",
    });

    setShowModal(true);
  };
  const handleSave = async () => {
    if (!formData.provider || !formData.tracking_number) {
      toast.error("Please fill in Provider and Tracking Reference");
      return;
    }
    const payload = {
      po_id: poId,
      shipments: [{
        ...formData,
        shipping_id: editingShippingId, // important for edit
        shipping_date: formatToISODate(formData.shipping_date),
      }],
    };

    try {
      const response = await apiFetch(
        API_ENDPOINTS.save_item_shipping,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (response.status) {
        toast.success(isEditMode ? "Shipment updated" : "Shipment saved");

        setShowModal(false);
        setIsEditMode(false);
        setEditingShippingId(null);

        setFormData({
          provider: preferredShippingProvider || "",
          tracking_number: "",
          shipping_date: today,
          status: null,
        });

        loadData();
      } else {
        toast.error("Error saving shipment");
      }
    } catch (error) {
      toast.error("Network error while saving");
    }
  };

  /* ------------------ API: Delete Shipment ------------------ */
  const handleDeleteShipment = async () => {
    const params = new URLSearchParams();
    params.append("po_shipping_id", selectedShippingId);

    try {
      const response = await fetch(`${API_BASE}api/purchaseorder/api/purchase-order/delete_shipment/`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: params.toString(),
      });

      if (response.ok) {
        toast.success("Shipment record deleted!");
        setShowDeleteConfirm(false);
        loadData();
      } else {
        toast.error("Error deleting shipment");
      }
    } catch (error) {
      toast.error("Network error while deleting");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary spinner-border-sm" />
      </div>
    );
  }

 return (
  <div className="p-3 bg-light min-vh-100">
    {/* Check if products array exists and has data */}
    {products && products.length > 0 ? (
      <>
        <div  className="border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm mb-0 align-middle">
                <thead className="table-light small text-uppercase text-secondary">
                  <tr>
                    <th className="ps-2 py-2 text-start">SHIPPING COMPANY</th>
                    <th className="ps-2 py-2">TRACKING REF</th>
                    <th className="ps-2 py-2">STATUS</th>
                    <th className="ps-2 py-2 " style={{ width: '90px' }}>SHIPPING DATE</th>
                    <th className="text-end" style={{ width: '120px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products[0].shipping_details && products[0].shipping_details.length > 0 ? (
                    products[0].shipping_details.map((ship, idx) => (
                      <tr key={ship.shipping_id || idx} className="border-bottom">
                        <td className="ps-2 py-2 align-middle">{ship.carrier_name}</td>
                        <td className="ps-2 py-2 align-middle">
                          <span
                            dangerouslySetInnerHTML={{ __html: ship.tracking_link }}
                            className="text-primary text-decoration-none fw-bold"
                          />
                        </td>
                        <td className="ps-2 py-2 align-middle">
                          {(() => {
                            const statusObj = SHIPPING_STATUS.find(
                              (item) => String(item.id) === String(ship.status)
                            );

                            if (!statusObj) return null;

                            // Remove spaces from class name safely
                            const statusClass = statusObj.value.replace(/\s+/g, '');

                            return (
                              <span className={`shipment-status ${statusClass}`}>
                                {statusObj.value}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="ps-2 py-2 align-middle">{formattedDate(ship.shipping_date)}</td>
                        <td className="ps-2 pe-0 py-2 text-end" >
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info me-2"
                              onClick={() => handleEditShipment(ship)}
                            >
                              <i className="fa fa-pen-alt" />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger shadow-sm"
                              onClick={() => {
                                setSelectedShippingId(ship.shipping_id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-5 text-muted small">
                        No shipping details available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div></>
    ) : (
      /* NO RECORDS FOUND STATE */
      <div className="text-center py-5 bg-white shadow-sm border rounded">
        <i className="fa fa-box-open fa-3x text-muted mb-3"></i>
        <h5 className="text-secondary fw-bold">No shipping records found</h5>
        <p className="text-muted small">There are no products or tracking details available for this order.</p>
      </div>
    )}

    {/* Save Modal */}
    {showModal && (
      <>
        <div className="modal fade show d-block"  tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditMode ? "Edit Shipping" : "Add New Shipping"}
                </h5>
                <button type="button" className="btn-close"  onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditingShippingId(null);
                }}></button>
              </div>
              <div className="modal-body shipping-model p-4" style={{overflow:"hidden !important"}}>
                <div className="row g-3 mb-3">
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-muted">Shipping Company <span className="text-danger">*</span></label>
                   <select
                      className="form-select"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    >
                      <option value="">Select</option>
                      {shippingProviders&& shippingProviders.map((provider) => (
                        <option key={provider.carrier_id} value={provider.carrier_id}>{provider.carrier_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-muted">Tracking # <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tracking #"
                      value={formData.tracking_number}
                      onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                    />
                  </div>


                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-muted">Shipping Date</label>
                    <DateInput
                        value={formData.shipping_date}
                        onChange={(value) => {
                          setFormData({ ...formData, shipping_date: value });
                        }}
                      />
                   
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-muted">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="">Select</option>
                      {SHIPPING_STATUS.map((provider) => (
                        <option key={provider.id} value={provider.id}>{provider.value}</option>
                      ))}
                    </select>
                  </div>

                </div>
                {/*
                <div className="row g-3 mb-3  d-none">
                <div className="col-md-3 d-none">
                    <label className="form-label small fw-bold text-muted">Delivery Days Avg</label>
                    <DateInput
                        value={formData.delivery_eta_date}
                        onChange={(value) => {
                          setFormData({ ...formData, delivery_eta_date: value });
                        }}
                      />
                    
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-muted">Vendor PO</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={formData.vendor_po}
                      onChange={(e) => setFormData({ ...formData, vendor_po: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3  d-none">
                    <label className="form-label small fw-bold text-muted">Vendor PO Order No</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={formData.vendor_po_order_no}
                      onChange={(e) => setFormData({ ...formData, vendor_po_order_no: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3  d-none">
                    <label className="form-label small fw-bold text-muted">Vendor PO Order Date</label>
                    <DateInput
                        value={formData.vendor_po_order_date}
                        onChange={(value) => {
                          setFormData({ ...formData, vendor_po_order_date: value });
                        }}
                      />
                  </div>
                  <div className="col-md-3" style={{ position: 'relative', zIndex: 100 }}>
                    <label className="form-label small fw-bold text-muted">Delivery Date</label>
                    <DateInput
                        value={formData.delivery_date}

                        onChange={(value) => {
                          setFormData({ ...formData, delivery_date: value });
                        }}
                      />
                   
                  </div>
                </div>*/}
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-success px-4 shadow-sm" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <>
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content border-0 shadow text-center p-4">
              <h3 className="fw-bold mb-3">Are you sure?</h3>
              <p className="text-muted">This shipment record will be permanently deleted!</p>
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button className="btn btn-secondary px-4" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn btn-danger px-4" onClick={handleDeleteShipment}>Yes, delete it!</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
    )}
  </div>
);
};

export default ShippingTab;