import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE } from "../../Config/api";
import { apiFetch } from "../../Utils/apiFetch";

const CountriesList = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchCountries = async (page = 1) => {
        setLoading(true);
        try {
            // Appending page and search query to the URL
            const url = `${API_BASE}api/countries?page=${page}&q=${search}`;
            const res = await apiFetch(url);
            
            if (res.status) {
                setCountries(res.data); // Setting the array of 10 items
                setPagination({
                    current_page: page,
                    last_page: res.last_page, // 25 from your sample
                    total: res.total_record   // 250 from your sample
                });
            }
        } catch (e) {
            console.error("Failed to fetch countries", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will remove the country and its associated states.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            const res = await apiFetch(`${API_BASE}api/countries/delete/${id}`, { method: "DELETE" });
            if (res.status) {
                Swal.fire("Deleted!", "Country removed.", "success");
                fetchCountries(pagination.current_page);
            }
        }
    };

    return (
        <div className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0 fw-bold">Countries</h3>
                
            </div>

            {/* Search Bar */}
            <div className="card shadow-sm border-0 mb-3 p-2 bg-light">
                <div className="input-group" style={{ maxWidth: "350px" }}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by name or ISO..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={() => fetchCountries(1)}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>

            {/* Standard Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead className="table-light text-secondary">
                            <tr>
                                <th className="ps-3">Name</th>
                                <th className="text-center">ISO2</th>
                                <th className="text-center">ISO3</th>
                                <th className="text-center"># of States</th>
                                <th className="text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5">Loading...</td></tr>
                            ) : countries.map((item) => (
                                <tr key={item.id} className="align-middle">
                                    <td className="ps-3">{item.name}</td>
                                    <td className="text-center">{item.iso2}</td>
                                    <td className="text-center">{item.iso3}</td>
                                    <td className="text-center">{item.num_states}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-dark me-1" onClick={() => navigate(`/settings/countries/${item.id}/edit`)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Manual Pagination Controls */}
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center py-3">
                    <div className="small text-muted">
                        Showing {(pagination.current_page - 1) * 10 + 1} to {Math.min(pagination.current_page * 10, pagination.total)} of {pagination.total} countries
                    </div>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchCountries(1)}>First</button>
                            </li>
                            <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchCountries(pagination.current_page - 1)}>Previous</button>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">{pagination.current_page}</span>
                            </li>
                            <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchCountries(pagination.current_page + 1)}>Next</button>
                            </li>
                            <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchCountries(pagination.last_page)}>Last</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default CountriesList;