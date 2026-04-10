import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../../Utils/apiFetch";
import { API_BASE } from "../../Config/api";

const StateModals = ({ config, countryId, onClose, onRefresh }) => {
    const { type, data } = config;
    const [formData, setFormData] = useState({ name: "", iso2: "" });

    useEffect(() => {
        if (type === 'edit' && data) setFormData({ name: data.name, iso2: data.iso2 });
    }, [type, data]);

    const handleSave = async () => {
        const url = type === 'add' 
            ? `${API_BASE}api/countries/${countryId}/states/create`
            : `${API_BASE}api/states/update/${data.id}`;
        
        const res = await apiFetch(url, {
            method: type === 'add' ? "POST" : "PUT",
            body: JSON.stringify(formData)
        });

        if (res.status) {
            Swal.fire("Success", "State saved", "success");
            onRefresh();
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0">
                    <div className={`modal-header `}>
                        <h6 className="modal-title">{type === 'add' ? 'Add New State' : `Edit State — ${data.name}`}</h6>
                        <button className="btn-close btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Name</label>
                            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">ISO2</label>
                            <input type="text" className="form-control" value={formData.iso2} onChange={e => setFormData({...formData, iso2: e.target.value})} />
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button className="btn btn-success" onClick={handleSave}>
                            {type === 'add' ? 'Add' : 'Save'}
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateModals;