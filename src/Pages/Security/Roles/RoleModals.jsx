import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_BASE } from "../../../Config/api";

const RoleModals = ({ mode, initialData, onClose, onRefresh }) => {
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setRoleName(initialData.name || "");
        } else {
            setRoleName("");
        }
    }, [mode, initialData]);

    const handleSave = async () => {
        if (!roleName.trim()) {
            Swal.fire("Validation", "Please enter a role name.", "info");
            return;
        }

        setLoading(true);
        const url = mode === 'add' 
            ? `${API_BASE}api/roles/create` 
            : `${API_BASE}api/roles/update/${initialData.id}`;

        try {
            const response = await apiFetch(url, {
                method: mode === 'add' ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: roleName })
            });

            const resData = await response;

            if (resData.status) {
                Swal.fire({
                    icon: 'success',
                    title: `Role ${mode === 'add' ? 'Created' : 'Updated'}`,
                    timer: 1500,
                    showConfirmButton: false
                });
                onRefresh();
                onClose();
            } else {
                throw new Error(resData.message || "Something went wrong");
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
                    <div className="modal-header border-bottom">
                        <h6 className="modal-title fw-bold">
                            {mode === 'add' ? 'Add New Role' : `Edit Role — ${initialData?.name}`}
                        </h6>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    
                    <div className="modal-body px-4 pb-4 mt-3">
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase">Role Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={roleName} 
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="e.g. Administrator, Sales, Manager"
                                disabled={loading}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-light px-4" onClick={onClose} disabled={loading}>
                                Cancel
                            </button>
                            <button 
                                className={`btn ${mode === 'add' ? 'btn-success' : 'btn-primary'} px-4 shadow-sm`} 
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : mode === 'add' ? 'Create Role' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleModals;