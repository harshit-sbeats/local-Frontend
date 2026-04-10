import React, { useState, useEffect, useCallback } from "react";
import { Table, Button } from 'react-bootstrap';
import { apiFetch } from "../../../../Utils/apiFetch";
import { API_BASE } from "../../../../Config/api";
import { useMasterData } from "../../../../Context/MasterDataProvider";
import WarehouseModal from "../modals/WarehouseModal";
import Swal from "sweetalert2";

const WarehouseTab = ({ vendorId }) => {
    const { countries } = useMasterData();
    const [vendorWarehouses, setVendorWarehouses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [warehouseStates, setWarehouseStates] = useState([]);
    const [tempWarehouse, setTempWarehouse] = useState({ name: "", delivery_name: "", address_line1: "", country_id: "", state_id: "", city: "", zip: "" });

    const fetchWarehouses = useCallback(async () => {
        const res = await apiFetch(`${API_BASE}api/vendor/warehouse/getall/${vendorId}`);
        if (res.status) setVendorWarehouses(res.data || []);
    }, [vendorId]);

    useEffect(() => { fetchWarehouses(); }, [fetchWarehouses]);

    const handleCountryChange = async (countryId) => {
        setTempWarehouse(prev => ({ ...prev, country_id: countryId, state_id: "" }));
        if (!countryId) return setWarehouseStates([]);
        const res = await apiFetch(`${API_BASE}api/common/list_states/?country_id=${countryId}`);
        if (res?.results) setWarehouseStates(res.results);
    };

    const handleSave = async () => {
        const url = tempWarehouse.id ? `${API_BASE}api/vendor/warehouse/update/${tempWarehouse.id}` : `${API_BASE}api/vendor/warehouse/addNew/${vendorId}`;
        const res = await apiFetch(url, { method: "POST", body: JSON.stringify(tempWarehouse) });
        if (res.status) {
            setShowModal(false);
            fetchWarehouses();
        }
    };

    return (
        <div className="py-2 px-2">
            <Button variant="link" className="float-end mb-2 small" onClick={() => { setTempWarehouse({ name: "" }); setShowModal(true); }}>
                <i className="fas fa-plus-circle me-1"></i> Add Location
            </Button>
            <Table size="sm" bordered hover className="text-center align-middle small">
                <thead className="table-light">
                    <tr><th>NAME</th><th>DELIVERY NAME</th><th>CITY</th><th>ACTION</th></tr>
                </thead>
                <tbody>
                    {vendorWarehouses.map(w => (
                        <tr key={w.id}>
                            <td>{w.name}</td><td>{w.delivery_name}</td><td>{w.city}</td>
                            <td>
                                <Button variant="link" size="sm" className="text-success p-0 me-2" onClick={() => { setTempWarehouse(w); handleCountryChange(w.country_id); setShowModal(true); }}><i className="fas fa-pen"></i></Button>
                                <Button variant="link" size="sm" className="text-danger p-0"><i className="fas fa-trash"></i></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <WarehouseModal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                tempWarehouse={tempWarehouse} 
                setTempWarehouse={setTempWarehouse} 
                countries={countries} 
                warehouseStates={warehouseStates} 
                onSave={handleSave} 
                onCountryChange={handleCountryChange} 
            />
        </div>
    );
};

export default WarehouseTab;