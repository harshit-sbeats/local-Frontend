import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StateModals from "./StateModals";
import { API_BASE } from "../../Config/api";
import { apiFetch } from "../../Utils/apiFetch";
import Swal from "sweetalert2";

const CountryEditView = () => {
    const { countryId } = useParams();
    const navigate = useNavigate();

    const [countryData, setCountryData] = useState({
        name: "", iso2: "", iso3: "", currency: "", currency_name: "", symbol: "",
    });
    
    const [states, setStates] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [modalConfig, setModalConfig] = useState({ type: null, data: null });

    // --------------------------------------------------
    // LOAD DATA: Fetch Country Details & States List
    // --------------------------------------------------
    const loadData = async (page = 1) => {
        setLoading(true);
        try {
            const url = `${API_BASE}api/countries/${countryId}?page=${page}&q=${search}`;
            const res = await apiFetch(url);

            if (res.status) {
                setCountryData(res.country);
                setStates(res.states.data || []);
                setPagination({
                    current_page: page,
                    last_page: res.states.last_page,
                    total: res.states.total_record
                });
            }
        } catch (err) {
            console.error("Error loading country data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (countryId) loadData();
    }, [countryId]);

    const handleSaveChanges = async () => {
        const res = await apiFetch(`${API_BASE}api/countries/update/${countryId}`, {
            method: "PUT",
            body: JSON.stringify(countryData),
        });
        if (res.status) Swal.fire("Success", "Country details updated", "success");
    };

    const handleDeleteState = async (stateId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This state will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            const res = await apiFetch(`${API_BASE}api/states/delete/${stateId}`, { method: "DELETE" });
            if (res.status) {
                Swal.fire("Deleted", "State removed.", "success");
                loadData(pagination.current_page);
            }
        }
    };

    return (
        <div className="pt-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Edit Country — {countryData.name}</h4>
                <button className="btn btn-outline-dark btn-sm shadow-sm" onClick={() => navigate("/settings/countries")}>
                    <i className="fas fa-arrow-left me-2"></i>Back to Countries
                </button>
            </div>

            {/* SECTION 1: Country Information Form */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="mb-0 fw-bold text-dark"><i className="fas fa-info-circle me-2"></i>Country Information</h6>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {Object.keys(countryData).map((key) => key !== 'id' && (
                            <div className="col-md-4" key={key}>
                                <label className="form-label small fw-bold text-muted">{key.toUpperCase()}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={countryData[key] || ""}
                                    onChange={(e) => setCountryData({ ...countryData, [key]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="text-end mt-4">
                        <button className="btn btn-success px-4 shadow-sm" onClick={handleSaveChanges}>
                            <i className="fas fa-save me-2"></i>Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Manual States Table */}
            <div className="card shadow-sm border-0">
            <div className="modal-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
    {/* Left Side: Title with Icon */}
    <h6 className="fw-bold mb-0 text-primary">
        <i className="fas fa-map-marker-alt me-2"></i>
        States in {countryData.name}
    </h6>

    {/* Right Side: Search & Actions */}
    <div className="d-flex align-items-center gap-2">
        {/* Integrated Search Group */}
        <div className="input-group input-group-sm" style={{ width: "250px" }}>
            <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="fas fa-search"></i>
            </span>
            <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search states..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadData(1)}
            />
            <button 
                className="btn btn-primary" 
                type="button" 
                onClick={() => loadData(1)}
            >
                Search
            </button>
        </div>

        {/* Add Button with shadow for depth */}
        <button 
            className="btn btn-success btn-sm px-3 shadow-sm d-flex align-items-center" 
            onClick={() => setModalConfig({ type: "add", data: null })}
        >
            <i className="fas fa-plus-circle me-2"></i>
            Add State
        </button>
    </div>
</div>
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-3">State Name</th>
                                <th>ISO Code</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="text-center py-4">Loading states...</td></tr>
                            ) : states.map((state) => (
                                <tr key={state.id} className="align-middle">
                                    <td className="ps-3">{state.name}</td>
                                    <td>{state.iso2}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-success me-1" onClick={() => setModalConfig({ type: "edit", data: state })}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteState(state.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Manual Pagination Controls */}
                <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                    <div className="small text-muted">Page {pagination.current_page} of {pagination.last_page}</div>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => loadData(pagination.current_page - 1)}>Previous</button>
                            </li>
                            <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => loadData(pagination.current_page + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {modalConfig.type && (
                <StateModals
                    config={modalConfig}
                    countryId={countryId}
                    onClose={() => setModalConfig({ type: null, data: null })}
                    onRefresh={() => loadData(pagination.current_page)}
                />
            )}
        </div>
    );
};

export default CountryEditView;