import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../../../Config/api";
import { getCookie, apiFetch } from "../../../Utils/apiFetch";

const ShippingProviderModals = ({ config, onClose, onRefresh }) => { 
    const { type, data } = config;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        carrier_name: "",
        carrier_code: "",
        class_code: "",
        tracking_url: ""
    });

    useEffect(() => {
        if ((type === 'edit' || type === 'status') && data) {
            setFormData({
                carrier_name: data.carrier_name || "",
                carrier_code: data.carrier_code || "",
                class_code: data.class_code || "",
                tracking_url: data.tracking_url || ""
            });
        }
    }, [type, data]);

    const handleSave = async () => {
        if (!formData.carrier_name || !formData.tracking_url) {
            return Swal.fire("Required", "Carrier name and Tracking URL are required.", "info");
        }

        setLoading(true);
        const url = type === 'add' ? `${API_BASE}api/shipping-providers/create` : `${API_BASE}api/shipping-providers/update/${data.carrier_id}`;
        
        try {
            const res = await apiFetch(url, {
                method: type === 'add' ? "POST" : "PUT",
                body: JSON.stringify(formData)
            });

            if (res.status) {
                Swal.fire("Success", res.message || "Carrier saved", "success");
                onRefresh();
                onClose();
            }else
                 Swal.fire("Error", res.message || "Error in create", "error");
        } catch (e) {
            Swal.fire("Error", e.message || "Operation failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${API_BASE}api/shipping-providers/toggle-status/${data.carrier_id}`, { method: "POST" });
            if (res.status) {
                Swal.fire("Updated", res.message, "success");
                onRefresh();
                onClose();
            }
        } catch (e) {
            Swal.fire("Error", e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    // --- Status Modal View ---
    if (type === 'status') {
        const isActive = data.status === 'Active' || data.status === 1;
        return (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg p-3">
                        <div className="modal-header border-0 justify-content-center">
                            <h4 className="modal-title fw-bold text-dark">
                                {isActive ? 'Deactivate Carrier?' : 'Activate Carrier?'}
                            </h4>
                        </div>
                        <div className="modal-body text-center py-4">
                            <p className="text-muted h5">Are you sure you want to change the status of <strong>{data.name}</strong>?</p>
                        </div>
                        <div className="modal-footer border-0 justify-content-center gap-2">
                            <button className={`btn ${isActive ? 'btn-warning' : 'btn-success'} px-4 py-2`} onClick={handleStatusToggle} disabled={loading}>
                                {loading ? 'Processing...' : `Yes, ${isActive ? 'Deactivate' : 'Activate'}`}
                            </button>
                            <button className="btn btn-secondary px-4 py-2" onClick={onClose} disabled={loading}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Add/Edit Modal View ---
    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header py-3 border-bottom d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 ">
                            <i className={`fas ${type === 'add' ? 'fa-plus' : 'fa-pen'} me-2`}></i> 
                            {type === 'add' ? 'Add New Shipping Carrier' : 'Edit Shipping Carrier'}
                        </h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="card-body p-4">
                        <div className="  p-2 mb-4 bg-white shadow-sm">
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label small fw-bold">Carrier Name<span className="text-danger">*</span></label>
                              
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" placeholder="e.g. DHL Express" value={formData.carrier_name} onChange={(e) => setFormData({...formData, carrier_name: e.target.value})} />
                                </div>
                            </div>

                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label small fw-bold">Carrier Code</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" placeholder="e.g. DHL" value={formData.carrier_code} onChange={(e) => setFormData({...formData, carrier_code: e.target.value})} />
                                </div>
                            </div>

                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-4 col-form-label small fw-bold">Class Code <span className="text-danger">*</span></label>
                                <div className="col-sm-8">
                                    <select className="form-select" value={formData.class_code} onChange={(e) => setFormData({...formData, class_code: e.target.value})}>
                                        <option value="" >select</option>
                                        <option value="Ground">Ground</option>
                                        <option value="Standard" >Standard</option>
                                        <option value="Expedited">Expedited</option>
                                        <option value="Priority">Priority</option>
                                        <option value="Overnight">Overnight</option>
                                        <option value="Freight Class">Freight Class</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-1 align-items-center">
                                <label className="col-sm-4 col-form-label small fw-bold">Tracking URL Format <span className="text-danger">*</span></label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" placeholder="https://tracking.link/{0}" value={formData.tracking_url} onChange={(e) => setFormData({...formData, tracking_url: e.target.value})} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-8">
                                    <div className="alert alert-info py-2 px-3 mt-2 border-0" style={{ fontSize: "0.8rem" }}>
                                        <i className="fas fa-lightbulb me-2"></i>
                                        Use <strong>{'{0}'}</strong> as a placeholder for the tracking number.
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-light px-4 border" onClick={onClose} disabled={loading}>Cancel</button>
                            <button className="btn btn-primary px-4 shadow-sm" onClick={handleSave} disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-save me-2"></i>}
                                {type === 'add' ? 'Save ' : 'Update '}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingProviderModals;