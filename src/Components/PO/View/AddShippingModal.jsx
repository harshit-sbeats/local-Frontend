import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMasterData } from "../../../Context/MasterDataProvider";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_ENDPOINTS } from "../../../Config/api";
import { formatToISODate } from "../../../Utils/utilFunctions";
import { SHIPPING_STATUS } from "../../../Constants/shippingStatus";
import DateInput from "../../Common/DateInput";

const AddShippingModal = ({ poId, preferredShippingProvider, onClose, onSuccess }) => {
    const { shippingProviders } = useMasterData();
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        provider: preferredShippingProvider || "",
        tracking_number: "",
        shipping_date: today,
        status: null,
    });

    useEffect(() => {
        if (preferredShippingProvider) {
            setFormData(prev => ({ ...prev, provider: preferredShippingProvider }));
        }
    }, [preferredShippingProvider]);

    const handleSave = async () => {
        if (!formData.provider || !formData.tracking_number) {
            toast.error("Please fill in Provider and Tracking Reference");
            return;
        }

        const payload = {
            po_id: poId,
            shipments: [{
                ...formData,
                shipping_date: formatToISODate(formData.shipping_date),
            }],
        };

        try {
            const response = await apiFetch(API_ENDPOINTS.save_item_shipping, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (response.status) {
                toast.success("Shipping added successfully!");
                onSuccess && onSuccess();
                onClose && onClose();
            } else {
                toast.error("Error saving shipment");
            }
        } catch (error) {
            toast.error("Network error while saving");
        }
    };

    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold">Add New Shipping</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                    <label className="form-label small fw-bold text-muted">Shipping Company <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={formData.provider}
                                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        {shippingProviders && shippingProviders.map((provider) => (
                                            <option key={provider.carrier_id} value={provider.carrier_id}>
                                                {provider.carrier_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-bold text-muted">Tracking # <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter tracking #"
                                        value={formData.tracking_number}
                                        onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-bold text-muted">Shipping Date</label>
                                    <DateInput
                                        value={formData.shipping_date}
                                        onChange={(value) => setFormData({ ...formData, shipping_date: value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-bold text-muted">Status</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        {SHIPPING_STATUS.map((s) => (
                                            <option key={s.id} value={s.id}>{s.value}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancel</button>
                            <button type="button" className="btn btn-success px-4 shadow-sm" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default AddShippingModal;