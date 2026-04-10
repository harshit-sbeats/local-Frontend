import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../../../Config/api";
import { apiFetch } from "../../../Utils/apiFetch";

const InventoryWarehouseModals = ({ config, onClose, warehouseLocations, onRefresh }) => { 
    const { type, data } = config;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        warehouse_name: "",
        location: "",
        status: 1,
        is_default: 0
    });

    useEffect(() => {
        if (type === 'edit' && data) {
            setFormData({
                warehouse_id: data.warehouse_id ,
                warehouse_name: data.warehouse_name ,
                location: data.location ,
                status: data.status,
                is_default: data.is_default 
            });
        }
    }, [type, data]);

    const handleSave = async () => {
        if (!formData.warehouse_name || !formData.location) {
            return Swal.fire("Required", "Inventory Name and Location are required.", "info");
        }

        setLoading(true);
        const url = type === 'add' 
            ? `${API_BASE}api/inventory-locations/create` 
            : `${API_BASE}api/inventory-locations/update/${data.warehouse_id}`;
        
        try {
            const res = await apiFetch(url, {
                method: type === 'add' ? "POST" : "PUT",
                body: JSON.stringify(formData)
            });

            if (res.status) {
                Swal.fire("Success", res.message || "Inventory saved", "success");
                onRefresh();
                onClose();
            } else {
                Swal.fire("Error", res.message || "Error saving Inventory", "error");
            }
        } catch (e) {
            Swal.fire("Error", e.message || "Operation failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    {/* Header color changes based on type like your original images */}
                    <div className={`modal-header py-3 border-bottom d-flex justify-content-between align-items-center `}>
                        <h5 className="mb-0">
                            {type === 'add' ? 'Add New Inventory' : 'Edit Warehouse'}
                        </h5>
                        <button className="btn-close btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Warehouse Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Warehouse name" 
                                value={formData.warehouse_name} 
                                onChange={(e) => setFormData({...formData, warehouse_name: e.target.value})} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Location</label>
                            <select 
                                className="form-select" 
                                value={formData.location} 
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            >
                                <option value="">select</option>
                                {warehouseLocations?.map((d)=>{
                                  return  <option value={d.id} key={d.id}>{d.name}</option>

})}
                            </select>
                        </div>

                        <div className="row mb-3">
                            <div className="col-6">
                                <label className="form-label small fw-bold d-block">Active Status</label>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="status" id="s1" value="1" checked={formData.status === 1} onChange={() => setFormData({...formData, status: 1})} />
                                    <label className="form-check-label" htmlFor="s1">Enabled</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="status" id="s2" value="0" checked={formData.status === 0} onChange={() => setFormData({...formData, status: 0})} />
                                    <label className="form-check-label" htmlFor="s2">Disabled</label>
                                </div>
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-bold d-block">Is Primary</label>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="is_default" value="1" id="p1" checked={formData.is_default === 1} onChange={() => setFormData({...formData, is_default: 1})} />
                                    <label className="form-check-label" htmlFor="p1">Enabled</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="is_default" id="p2"  value="0"  checked={formData.is_default === 0} onChange={() => setFormData({...formData, is_default: 0})} />
                                    <label className="form-check-label" htmlFor="p2">Disabled</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button className="btn btn-success px-4" onClick={handleSave} disabled={loading}>
                            {loading ? 'Processing...' : (type === 'add' ? 'Create' : 'Save')}
                        </button>
                        <button className="btn btn-secondary px-4" onClick={onClose} disabled={loading}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryWarehouseModals;