import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../../Config/api";
import { apiFetch } from "../../Utils/apiFetch";

const UOMModal = ({ mode, initialData, onClose, onRefresh }) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name || "");
      setShortName(initialData.short_name || "");
      setStatus(initialData.status?.toString() || "1");
    }
  }, [mode, initialData]);

  const handleSave = async () => {
    if (!name.trim() || !shortName.trim()) {
      Swal.fire("Validation", "Both Name and Short Code are required.", "info");
      return;
    }

    setLoading(true);
    const id = initialData?.uom_id;
    const baseUrl = `${API_BASE}api/product_api/product_uom`;
    const url = mode === 'add' ? `${baseUrl}/create` : `${baseUrl}/update/${id}`;

    const payload = {
      name: name,
      short_name: shortName,
      status: parseInt(status)
    };

    try {
      const response = await apiFetch(url, {
        method: mode === 'add' ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const resData = await response;
      console.log(resData);
      if (resData.status) {
        Swal.fire({ icon: 'success', title: 'Unit Saved', timer: 1500, showConfirmButton: false });
        onRefresh();
        onClose();
      } else {
        throw new Error(resData.message || "Failed to save unit.");
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
          <div className="modal-header border-bottom">
            <h6 className="modal-title fw-bold">{mode === 'edit' ? 'Edit Unit' : 'Add New Unit'}</h6>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">Unit Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Kilogram"
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Short Code</label>
              <input 
                type="text" 
                className="form-control text-uppercase" 
                value={shortName} 
                onChange={(e) => setShortName(e.target.value)} 
                placeholder="e.g. KG"
                disabled={loading}
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
            <button 
              className={`btn ${mode === 'add' ? 'btn-success' : 'btn-primary'} px-4`} 
              onClick={handleSave} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Unit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UOMModal;