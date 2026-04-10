import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { apiFetch } from "../../Utils/apiFetch";
import { API_BASE } from "../../config/api";
import { toast } from "react-hot-toast";

const VendorWarehouseModal = ({ show, onHide, vendorId, editData, onSaveSuccess, countries }) => {
    // Local state for the modal only
    const [tempWarehouse, setTempWarehouse] = useState({ 
        name: "", delivery_name: "", address_line1: "", address_line2: "", 
        city: "", state_id: "", zip: "", country_id: "" 
    });
    const [warehouseStates, setWarehouseStates] = useState([]);

    // Sync local state when editData changes (when opening for edit)
    useEffect(() => {
        if (editData) {
            setTempWarehouse(editData);
            if (editData.country_id) {
                fetchStates(editData.country_id, editData.state_id);
            }
        } else {
            setTempWarehouse({ name: "", delivery_name: "", address_line1: "", address_line2: "", city: "", state_id: "", zip: "", country_id: "" });
            setWarehouseStates([]);
        }
    }, [editData, show]);

    const fetchStates = async (countryId, existingStateId = null) => {
        if (!countryId) return;
        try {
            const response = await apiFetch(`${API_BASE}api/common/list_states/?country_id=${countryId}`, { method: "GET" });
            if (response?.results) {
                setWarehouseStates(response.results);
                if (existingStateId) {
                    setTempWarehouse(prev => ({ ...prev, state_id: existingStateId }));
                }
            }
        } catch (err) { console.error("State fetch error", err); }
    };

    const handleCountryChange = (countryId) => {
        setTempWarehouse(prev => ({ ...prev, country_id: countryId, state_id: "" }));
        fetchStates(countryId);
    };

    const handleSave = async () => {
        const isEdit = !!tempWarehouse.warehouse_id;
        const url = isEdit 
            ? `${API_BASE}api/vendor/api/vendor_warehouse/update/${tempWarehouse.warehouse_id}`
            : `${API_BASE}api/vendor/api/vendor_warehouse/addNew/${vendorId}`;
        
        try {
            const res = await apiFetch(url, {
                method: isEdit ? "PUT" : "POST",
                body: JSON.stringify(tempWarehouse)
            });

            if (res.status) {
                toast.success(isEdit ? "Location updated" : "Location added");
                onSaveSuccess(); // Tell parent to refresh the table
                onHide(); // Close modal
            }
        } catch (err) { toast.error("Operation failed"); }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="h6 fw-bold">Warehouse / Location Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label className="small fw-bold">Warehouse Name</Form.Label>
                        <Form.Control 
                            size="sm" 
                            value={tempWarehouse.name || ""} 
                            onChange={e => setTempWarehouse({...tempWarehouse, name: e.target.value})} 
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Label className="small fw-bold">Delivery Contact Name</Form.Label>
                        <Form.Control 
                            size="sm" 
                            value={tempWarehouse.delivery_name || ""} 
                            onChange={e => setTempWarehouse({...tempWarehouse, delivery_name: e.target.value})} 
                        />
                    </Col>
                </Row>
                {/* ... Include the rest of your Address/City/State/Zip inputs here ... */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label className="small fw-bold">Country</Form.Label>
                        <Form.Select 
                            size="sm" 
                            value={tempWarehouse.country_id || ""} 
                            onChange={e => handleCountryChange(e.target.value)}
                        >
                            <option value="">Select</option>
                            {countries?.map(c => <option key={c.id} value={c.id}>{c.text}</option>)}
                        </Form.Select>
                    </Col>
                    <Col md={6}>
                        <Form.Label className="small fw-bold">State</Form.Label>
                        <Form.Select 
                            size="sm" 
                            value={tempWarehouse.state_id || ""} 
                            onChange={e => setTempWarehouse({...tempWarehouse, state_id: e.target.value})}
                            disabled={!tempWarehouse.country_id}
                        >
                            <option value="">Select State</option>
                            {warehouseStates.map(s => <option key={s.id} value={s.id}>{s.text}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSave}>Save Location</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VendorWarehouseModal;