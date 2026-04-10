import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE, API_ENDPOINTS } from "../../Config/api";
import { apiFetch, getCookie } from "../../Utils/apiFetch";

const AttributeModal = ({ mode, initialData, onClose, onRefresh }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("TEXT");
    const [defaultValue, setDefaultValue] = useState("");
    const [optionList, setOptionList] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setName(initialData.attribute_name || "");
            setType(initialData.attribute_type || "TEXT");
            setDefaultValue(initialData.default_value || "");
            setOptionList(initialData.option_list || "");
        }
    }, [mode, initialData]);

    const handleSave = async () => {
        if (!name.trim()) {
            Swal.fire("Error", "Attribute name is required", "error");
            return;
        }
        if (type === "DROPDOWN" && !optionList.trim()) {
            Swal.fire("Error", "Option list is required for Dropdown type", "error");
            return;
        }

        setLoading(true);
        const url = mode === 'add' 
            ? `${API_ENDPOINTS.CREATE_PRODUCT_ATTRIBUTE}` 
            : `${API_ENDPOINTS.UPDATE_PRODUCT_ATTRIBUTE}${initialData.attribute_id}`;

        const payload = {
            attribute_name: name,
            attribute_type: type,
            default_value: defaultValue,
            option_list: type === "DROPDOWN" ? optionList : ""
        };

        try {
            const response = await apiFetch(url, {
                method: mode === 'add' ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await response;
            if (data.status) {
                Swal.fire({ icon: 'success', title: 'Saved!', timer: 1000, showConfirmButton: false });
                onRefresh();
                onClose();
            } else {
                Swal.fire("Error", data.message || "Failed to save", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Connection error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className={`modal-header border-bottom ${mode === 'add' ? '' : ''}`}>
                        <h6 className="modal-title">{mode === 'add' ? 'Create Attribute' : 'Edit Attribute'}</h6>
                        <button type="button" className="btn-close btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Attribute Name</label>
                            <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Attribute Type</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="attrType" id="typeText" 
                                           checked={type === "TEXT"} onChange={() => setType("TEXT")} />
                                    <label className="form-check-label small" htmlFor="typeText">Text Input</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="attrType" id="typeDrop" 
                                           checked={type === "DROPDOWN"} onChange={() => setType("DROPDOWN")} />
                                    <label className="form-check-label small" htmlFor="typeDrop">Dropdown</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Default Value</label>
                            <input className="form-control" value={defaultValue} onChange={(e)=>setDefaultValue(e.target.value)} disabled={loading} />
                        </div>

                        {type === "DROPDOWN" && (
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-danger">Option List (separated by ||)</label>
                                <textarea className="form-control" rows="2" value={optionList} 
                                          onChange={(e)=>setOptionList(e.target.value)} 
                                          placeholder="Red||Blue||Green" disabled={loading} />
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-0 bg-light">
                        <button className="btn btn-secondary px-4" onClick={onClose} disabled={loading}>Cancel</button>
                        <button className={`btn ${mode === 'add' ? 'btn-success' : 'btn-primary'} px-4`} 
                                onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : mode === 'add' ? 'Create' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttributeModal;