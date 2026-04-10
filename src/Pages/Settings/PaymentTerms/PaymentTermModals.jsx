import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../../../Config/api";
import { apiFetch } from "../../../Utils/apiFetch";

const CSS = `
  .ptm-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.45);
    display:flex;align-items:center;justify-content:center;
    z-index:1050;backdrop-filter:blur(2px);
  }
  .ptm-modal {
    background:#fff;border-radius:16px;
    box-shadow:0 24px 60px rgba(0,0,0,.18);
    width:100%;max-width:460px;overflow:hidden;
    animation:ptm-in .18s ease;
  }
  @keyframes ptm-in {
    from { opacity:0;transform:translateY(-12px) scale(.98); }
    to   { opacity:1;transform:translateY(0) scale(1); }
  }
  .ptm-header {
    color:#0f0f1a;padding:18px 22px;
    display:flex;align-items:center;justify-content:space-between;
  }
  .ptm-header-left { display:flex;align-items:center;gap:12px; }
  .ptm-header-icon {
    width:34px;height:34px;border-radius:9px;
    color:#0f0f1a,
    display:flex;align-items:center;justify-content:center;
    font-size:14px;color:#e2e8f0;
  }
  .ptm-header-title { font-size:15px;font-weight:700;color:#0f0f1a;margin:0; }
  .ptm-header-sub   { font-size:11px;color:#64748b;margin:0; }
  .ptm-close-btn {
    background:rgba(255,255,255,.08);border:none;
    width:30px;height:30px;border-radius:8px;
    color:#94a3b8;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all .15s;font-size:13px;
  }
  .ptm-close-btn:hover { background:rgba(255,255,255,.15);color:#fff; }

  .ptm-body { padding:22px; }

  .ptm-field { margin-bottom:16px; }
  .ptm-label {
    display:block;font-size:11px;font-weight:700;
    color:#6b7280;text-transform:uppercase;letter-spacing:.5px;
    margin-bottom:6px;
  }
  .ptm-input, .ptm-select {
    width:100%;padding:9px 12px;border-radius:8px;
    border:1px solid #e5e7eb;font-size:13px;color:#0f0f1a;
    outline:none;transition:border-color .15s,box-shadow .15s;
    background:#fff;
  }
  .ptm-input:focus, .ptm-select:focus {
    border-color:#0f0f1a;
    box-shadow:0 0 0 3px rgba(15,15,26,.08);
  }
  .ptm-hint { font-size:11px;color:#9ca3af;margin-top:5px; }

  .ptm-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }

  .ptm-footer {
    padding:16px 22px;
    border-top:1px solid #f0f0f5;
    display:flex;justify-content:flex-end;gap:10px;
    background:#fafafa;
  }
  .ptm-btn-cancel {
    padding:9px 20px;border-radius:8px;border:1px solid #e5e7eb;
    background:#fff;color:#374151;font-size:13px;font-weight:600;
    cursor:pointer;transition:all .15s;
  }
  .ptm-btn-cancel:hover { background:#f3f4f6; }
  .ptm-btn-save {
    padding:9px 24px;border-radius:8px;border:none;
    background:#0f0f1a;color:#fff;font-size:13px;font-weight:700;
    cursor:pointer;transition:all .15s;
    display:flex;align-items:center;gap:8px;
  }
  .ptm-btn-save:hover { background:#1f1f35; }
  .ptm-btn-save:disabled { opacity:.5;cursor:not-allowed; }
`;

const PaymentTermModals = ({ config, onClose, onRefresh }) => {
  const { type, data } = config;
  const isEdit = type === "edit";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "", name: "", frequency: "", status: 1,
  });

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        type:      data.type,
        name:      data.name,
        frequency: data.frequency,
        status:    data.status,
      });
    }
  }, [type, data]);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!formData.name || !formData.frequency) {
      return Swal.fire("Required", "Please fill in all mandatory fields.", "info");
    }
    setLoading(true);
    const url = isEdit
      ? `${API_BASE}api/payment-terms/update/${data.id}`
      : `${API_BASE}api/payment-terms/create`;
    try {
      const res = await apiFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });
      if (res.status) {
        Swal.fire("Success", res.message || "Term saved", "success");
        onRefresh();
        onClose();
      } else {
        Swal.fire("Error", res.message, "error");
      }
    } catch (e) {
      Swal.fire("Error", "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ptm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="ptm-modal">

          {/* Header */}
          <div className="ptm-header">
            <div className="ptm-header-left">
              <div className="ptm-header-icon">
                <i className={`fas ${isEdit ? "fa-pen" : "fa-plus"}`} />
              </div>
              <div>
                <p className="ptm-header-title">{isEdit ? "Edit Payment Term" : "Add Payment Term"}</p>
                <p className="ptm-header-sub">{isEdit ? `Editing: ${data?.name}` : "Configure a new payment term"}</p>
              </div>
            </div>
            <button className="ptm-close-btn" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Body */}
          <div className="ptm-body">

            {/* Name */}
            <div className="ptm-field">
              <label className="ptm-label">Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                type="text"
                className="ptm-input"
                placeholder="e.g., NET 30"
                value={formData.name}
                onChange={e => set("name", e.target.value)}
              />
            </div>

            <div className="ptm-row">
              {/* Type */}
              <div className="ptm-field mb-0">
                <label className="ptm-label">Type</label>
                <select className="ptm-select" value={formData.type} onChange={e => set("type", e.target.value)}>
                  <option value="">Select</option>
                  <option value="1">Prepaid</option>
                  <option value="2">Postpaid</option>
                </select>
              </div>

              {/* Frequency */}
              <div className="ptm-field  mb-0">
                <label className="ptm-label">Frequency (Days) <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  type="number"
                  className="ptm-input"
                  placeholder="e.g., 30"
                  min="0"
                  value={formData.frequency}
                  onChange={e => set("frequency", e.target.value)}
                  onKeyDown={e => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                />
                <p className="ptm-hint">Enter number of days (7, 15, 30…)</p>
              </div>
            </div>

            {/* Status */}
            <div className="ptm-field">
              <label className="ptm-label">Status</label>
              <select className="ptm-select" value={formData.status} onChange={e => set("status", e.target.value)}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="ptm-footer">
            <button className="ptm-btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="ptm-btn-save" onClick={handleSave} disabled={loading}>
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> Processing…</>
                : <><i className={`fas ${isEdit ? "fa-save" : "fa-plus"}`} /> {isEdit ? "Save Changes" : "Create Term"}</>
              }
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PaymentTermModals;