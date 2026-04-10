import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../../Config/api";
import { apiFetch, getCookie } from "../../Utils/apiFetch";

const CategoryModal = ({ mode, initialData, main_categories, onClose, onRefresh }) => {
    const [name, setName] = useState("");
    const [isSubcategory, setIsSubcategory] = useState(false);
    const [parentId, setParentId] = useState("");
    const [status, setStatus] = useState("1");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setName(initialData.name || "");
            
            // FIX: If is_primary is 1 (True), isSubcategory should be false.
            // If is_primary is 0 (False), isSubcategory should be true.
            const subCheck = initialData.is_primary === 1 ? false : true;
            setIsSubcategory(subCheck);
            
            setParentId(initialData.parent_id || "");
            
            // Normalize status to string "1" or "0" for the select element
            const statusVal = (initialData.status === 1 || initialData.status === "1") ? "1" : "0";
            setStatus(statusVal);
        } else {
            // Reset for Add mode
            setName("");
            setIsSubcategory(false);
            setParentId("");
            setStatus("1");
        }
    }, [mode, initialData]);

    const handleSave = async () => {
        if (!name.trim()) {
            Swal.fire("Validation", "Please enter a category name.", "info");
            return;
        }

        if (isSubcategory && !parentId) {
            Swal.fire("Validation", "Please select a parent category.", "info");
            return;
        }

        setLoading(true);

        const baseUrl = `${API_BASE}api/product_api/product_categories`;
        // Use category_id or id based on your backend response
        const id =  initialData?.category_id;
        const url = mode === 'add' ? `${baseUrl}/create` : `${baseUrl}/update/${id}`;

        const payload = {
            name: name,
            status: parseInt(status), // Send as Integer
            is_primary: isSubcategory ? 0 : 1, // 1 for Primary, 0 for Sub
            parent_id: isSubcategory ? parentId : null
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

            if (resData.status) {
                Swal.fire({
                    icon: 'success',
                    title: `Category ${mode === 'add' ? 'Created' : 'Updated'}`,
                    timer: 1500,
                    showConfirmButton: false
                });
                onRefresh();
                onClose();
            } else {
                throw new Error(resData.message || "Operation failed");
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
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header border-bottom">
                        <h6 className="modal-title fw-bold">
                            {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
                        </h6>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-uppercase">Category Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                disabled={loading}
                                placeholder="Enter category name..."
                            />
                        </div>
                        
                        <div className="mb-3 p-2 bg-light rounded border">
                            <div className="form-check form-switch ms-3">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    id="subCheck" 
                                    checked={isSubcategory} 
                                    onChange={(e) => setIsSubcategory(e.target.checked)} 
                                    disabled={loading}
                                />
                                <label className="form-check-label small fw-bold" htmlFor="subCheck">
                                    Define as Subcategory
                                </label>
                            </div>
                        </div>

                        {isSubcategory && (
                            <div className="mb-3 animate__animated animate__fadeInDown">
                                <label className="form-label small fw-bold text-uppercase">Parent Category</label>
                                <select 
                                    className="form-select border-primary" 
                                    value={parentId} 
                                    onChange={(e) => setParentId(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">-- Select Parent --</option>
                                    {main_categories?.map((d)=>(
                                        <option value={d.id} key={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-uppercase">Status</label>
                            <select 
                                className="form-select" 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={loading}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer bg-light border-top">
                        <button className="btn btn-link text-decoration-none text-secondary px-4" onClick={onClose} disabled={loading}>Cancel</button>
                        <button 
                            className={`btn ${mode === 'add' ? 'btn-success' : 'btn-primary'} px-4 shadow-sm`} 
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                            {mode === 'add' ? 'Create Category' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;