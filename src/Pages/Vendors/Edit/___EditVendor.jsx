import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab, Form, Spinner } from 'react-bootstrap';
import { toast } from "react-hot-toast";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_ENDPOINTS } from "../../../Config/api";
import StickyHeader from "../../../Components/StickyHeader";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';

// Sub-components
import PrimaryDetailsTab from "./tabs/PrimaryDetailsTab";
import WarehouseTab from "./tabs/WarehouseTab";
import AddressTab from "./tabs/AddressTab";
import ContactTab from "./tabs/ContactTab";
import DocumentTab from "./tabs/DocumentTab";
//import VendorPOList from "../../Components/VendorPOList";
import VendorPOList from "../../../Components/VendorPOList"; 

const PlaceholderTab = ({ icon, message }) => (
    <div className="p-4 text-center text-muted">
        <i className={`fas ${icon} fa-3x mb-3`}></i>
        <p>{message}</p>
    </div>
);

const EditVendor = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("primary");

    // Global Primary State
    const [primary, setPrimary] = useState({ 
        vendor_code: "", vendor_name: "", gst_number: "", tax_percent: "", 
        is_tax_free: false, payment_term: "", bank_name: "", bank_branch: "", 
        account_number: "", currency: "", company_abn: "", company_acn: "" 
    });

    const loadVendor = useCallback(async () => {
        if (!vendorId) return;
        setLoading(true);
        try {
            const res = await apiFetch(`${API_ENDPOINTS.GET_VENDOR_DETAILS}?vendor_id=${vendorId}`);
            if (res.status && res.data) {
                setPrimary(prev => ({ ...prev, ...res.data.primary }));
            }
        } catch (err) {
            toast.error("Data fetch failed");
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => { loadVendor(); }, [loadVendor]);

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("vendor_id", vendorId);
        formData.append("primary", JSON.stringify(primary));
        // Note: Logic for address/details can be aggregated here or passed via refs
        
        try {
            const res = await apiFetch(API_ENDPOINTS.save_vendor_details, {
                method: "POST",
                body: formData,
                isFormData: true
            });
            if (res?.status) toast.success("Vendor updated!");
        } catch (err) { toast.error("Update failed"); }
    };

    if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;

    return (
        <div className="mt-0">
            <StickyHeader>
                <div className="d-flex justify-content-between mb-2">
                    <h5 className="fw-bold px-2">Update Vendor: {primary.vendor_name}</h5>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary" onClick={() => navigate("/vendor/vendors")}><FontAwesomeIcon icon={faListUl} /> Listing</button>
                        <button className="btn btn-primary" onClick={handleUpdate}><FontAwesomeIcon icon={faSave} /> Update</button>
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faUndo} /> Cancel</button>
                    </div>
                </div>
            </StickyHeader>
            
            <div className="bg-white shadow-sm">
                <Form>
                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="custom-tabs mt-2">
                        <Tab eventKey="primary" title="Primary Details">
                            <PrimaryDetailsTab primary={primary} setPrimary={setPrimary} />
                        </Tab>
                        <Tab eventKey="vendor_warehouse" title="Warehouse Details">
                            <WarehouseTab vendorId={vendorId} />
                        </Tab>
                        <Tab eventKey="address" title="Address Details">
                            <AddressTab vendorId={vendorId} />
                        </Tab>
                        <Tab eventKey="contact" title="Contact Details">
                            <ContactTab vendorId={vendorId} />
                        </Tab>
                        <Tab eventKey="purchases" title="Purchases">
                            <VendorPOList vendorId={vendorId} />
                        </Tab>
                        <Tab eventKey="returns" title="Returns" disabled>
                            <PlaceholderTab icon="fa-undo-alt" message="Return history will be available after vendor activation." />
                        </Tab>
                    </Tabs>
                </Form>
            </div>
        </div>
    );
};

export default EditVendor;