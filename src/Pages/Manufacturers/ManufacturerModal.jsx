import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../../Config/api";
import { apiFetch, getCookie } from "../../Utils/apiFetch";

const ManufacturerModal = ({ mode, initialData, onClose, onRefresh }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name || "");
      setStatus(initialData.status?.toString() || "1");
    }
  }, [mode, initialData]);

  const handleSave = async () => {
    if (!name.trim()) {
      Swal.fire("Required", "Manufacturer name cannot be empty.", "info");
      return;
    }

    setLoading(true);
    const id = initialData?.manufacturer_id;
    const url = mode === 'add' 
      ? `${API_BASE}api/product_api/api/manufacturers/create` 
      : `${API_BASE}api/product_api/api/manufacturers/update/${id}`;

    try {
      const response = await apiFetch(url, {
        method: mode === 'add' ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, status: parseInt(status) }),
        credentials: "include"
      });

      const resData = await response;

      if (resData.status) {
        Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1500, showConfirmButton: false });
        onRefresh();
        onClose();
      } else {
        throw new Error(resData.message || "Failed to save.");
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
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <h6 className="modal-title fw-bold">{mode === 'edit' ? 'Edit Manufacturer' : 'New Manufacturer'}</h6>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">Manufacturer Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={loading}
                placeholder="Enter company name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
          <div className="modal-footer bg-light border-top">
            <button className="btn btn-secondary px-4" onClick={onClose} disabled={loading}>Cancel</button>
            <button className={`btn ${mode === 'add' ? 'btn-success' : 'btn-primary'} px-4`} onClick={handleSave} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              {mode === 'add' ? 'Save ' : 'Update '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerModal;