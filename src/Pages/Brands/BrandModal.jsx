import React, { useState, useEffect } from "react";
import { API_BASE } from "../../Config/api";
import Swal from "sweetalert2";
import { apiFetch } from "../../Utils/apiFetch";

const BrandModal = ({ mode, initialData, onClose, onRefresh }) => {
   
    const [name, setName] = useState("");
    const [status, setStatus] = useState(1); // Default
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setName(initialData.name || "");
            
            // Ensure the status matches the case of your <option> values exactly
            // If API returns "Active", it sets "Active". 
            setStatus(initialData?.status);
        }
    }, [mode, initialData]);

    const handleSave = async () => {
        if (!name.trim()) {
            Swal.fire("Validation", "Please enter a brand name.", "info");
            return;
        }

        setLoading(true);
        const isAdd = mode === 'add';
        
        // Use brand_id for the URL if editing
        const url = isAdd 
            ? `${API_BASE}api/product_api/api/brands/create` 
            : `${API_BASE}api/product_api/api/brands/update/${initialData.brand_id}`;
        
        try {
            const response = await apiFetch(url, {
                method: isAdd ? "POST" : "PUT",
                body: JSON.stringify({ name, status }), // Sending name and status to BE
                credentials: "include"
            });

            if (response.status) {
                Swal.fire({
                    icon: "success",
                    title: `Successfully ${isAdd ? 'Created' : 'Updated'}`,
                    timer: 1500,
                    showConfirmButton: false
                });
                onRefresh();
                onClose();
            } else {
                const errData = await response;
                throw new Error(errData.message || "Failed to save");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className={`modal-header ${mode === 'add' ? 'bg-' : ''}`}>
                        <h5 className="modal-title">{mode === 'add' ? 'Add New Brand' : 'Edit Brand'}</h5>
                        <button type="button" className="btn-close btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Brand Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Status</label>
                            
                            <select 
                                className="form-select" 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={loading}
                            >
                                {/* Values must match exactly what comes from initialData.status */}
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer bg-light">
                        <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button className={`btn ${mode === 'add' ? 'btn-success' : 'btn-primary'}`} onClick={handleSave} disabled={loading}>
                            {loading ? 'Processing...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandModal;