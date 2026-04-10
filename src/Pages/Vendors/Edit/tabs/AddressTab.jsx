import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { apiFetch } from "../../../../Utils/apiFetch";
import { API_BASE } from "../../../../config/api";
import { useMasterData } from "../../../../Context/MasterDataProvider";

const AddressTab = ({ vendorId }) => {
    const { countries } = useMasterData();
    const [billing, setBilling] = useState({});
    const [shipping, setShipping] = useState({});
    const [bStates, setBStates] = useState([]);
    const [sStates, setSStates] = useState([]);

    const fetchStates = async (countryId, type) => {
        if (!countryId) return;
        const res = await apiFetch(`${API_BASE}api/common/list_states/?country_id=${countryId}`);
        if (res?.results) { 
            type === 'billing' ? setBStates(res.results) : setSStates(res.results);
        }
    };

    const loadAddresses = useCallback(async () => {
        const res = await apiFetch(`${API_BASE}api/vendor/api/details?vendor_id=${vendorId}`);
        if (res.status && res.data.details) {
            const { billing_address, shipping_address } = res.data.details;
            setBilling(billing_address || {});
            setShipping(shipping_address || {});
            if (billing_address?.country) fetchStates(billing_address.country, 'billing');
            if (shipping_address?.country) fetchStates(shipping_address.country, 'shipping');
        }
    }, [vendorId]);

    useEffect(() => { loadAddresses(); }, [loadAddresses]);

    return (
        <div className="py-3 px-2">
            <Row>
                <Col md={6} className="border-end px-4">
                    <h6 className="fw-bold mb-3">Billing Address</h6>
                    {/* ... Billing Form Fields using bStates ... */}
                </Col>
                <Col md={6} className="px-4">
                    <h6 className="fw-bold mb-3">Shipping Address</h6>
                    {/* ... Shipping Form Fields using sStates ... */}
                </Col>
            </Row>
        </div>
    );
};

export default AddressTab;