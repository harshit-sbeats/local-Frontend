import React, { useState } from "react";
import Swal from 'sweetalert2';
import LocationModal from "./LocationModal"; // New component below
import { useMasterData } from "../../Context/MasterDataProvider";
import { API_BASE } from "../../Config/api";
import { apiFetch } from "../../Utils/apiFetch";
const OrganizationLocations = ({locations}) => {
  const { countries } = useMasterData(); // Fetch global country list
  const [modal, setModal] = useState({ show: false, mode: 'add', id: null });

  const handleEdit = (id) => {
    setModal({ show: true, mode: 'edit', id: id });
  };

  const handleDelete = (id, locationName) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "swal2-compact-design" },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await apiFetch(
          `${API_BASE}api/organizations/locations/delete/${id}`,
          { method: "DELETE" }
        );

        if (res.status) {
          Swal.fire("Deleted!", `${locationName} has been deleted.`, "success");

           setTimeout(()=>{
           window.location.reload()
        },600 ) 
          // OR remove locally:
          // setLocations(prev => prev.filter(l => l.id !== id));
        } else {
          Swal.fire("Error", res.message || "Delete failed", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    });
  };

  return (
    <div className="card shadow-sm border-0 mt-1">
      <div className="card-header border-bottom">
        <h6 className="card-title font-weight-bold">Locations</h6>
        <div className="card-tools">
        <button className="btn btn-primary btn-sm px-3" onClick={() => setModal({ show: true, mode: 'add', id: null })}>
          <i className="fas fa-plus me-1"></i> Add New
        </button></div> 
      </div>
      <div className="card-body p-0">
        <table className="table table-hover mb-0 align-middle" style={{ fontSize: '13px' }}>
          <thead className="table-light text-muted small">
            <tr>
              <th className="ps-4 py-3">Name</th>
              <th>Address</th>
              <th>City</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td className="ps-4 fw-bold">{loc.name}</td>
                <td>{loc.address}</td>
                <td>{loc.city}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-success me-2 p-1" onClick={() => handleEdit(loc.id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger p-1" onClick={() => handleDelete(loc.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.show && (
        <LocationModal 
          mode={modal.mode} 
          locationId={modal.id} 
          countries={countries}
          onClose={() => setModal({ ...modal, show: false })} 
        />
      )}
    </div>
  );
};

export default OrganizationLocations;