import React, { useEffect, useState, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { API_BASE } from "../../Config/api";
import UOMModal from "./UOMModal";
import Swal from "sweetalert2";
import { api, apiFetch } from "../../Utils/apiFetch";

const UnitOfMeasurement = () => {
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);
  const [modalConfig, setModalConfig] = useState({ 
    show: false, 
    mode: 'add', 
    initialData: null 
  });

  const openModal = (mode, data = null) => {
    setModalConfig({ show: true, mode, initialData: data });
  };

  const closeModal = () => {
    setModalConfig({ show: false, mode: 'add', initialData: null });
  };

  const refreshTable = () => {
    if (tabulatorRef.current) {
      tabulatorRef.current.setData(); 
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Unit?",
      text: "This may affect products using this unit.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiFetch(`${API_BASE}api/product_api/product_uom/delete/${id}`, { 
            method: "DELETE",
          });

          if (response.status) {
            Swal.fire("Deleted!", "Unit has been removed.", "success");
            refreshTable();
          } else {
            Swal.fire("Error!", response.message || "Deletion failed.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  const columns = [
    { title: "Unit Name", field: "name", hozAlign: "left", headerSort: false, formatter: (cell) => `<span class="fw-bold">${cell.getValue()}</span>` },
    { title: "Short Code", field: "short_name", width: 150, hozAlign: "center", headerSort: false },
    { 
      title: "Status", 
      field: "status", 
      width: 120, 
      headerSort: false,
      formatter: (cell) => {
        return cell.getValue() === 1 
          ? `<span class="badge badge-success fw-bold">Active</span>` 
          : `<span class="badge badge-secondary fw-bold">Inactive</span>`;
      }
    },
    {
      title: "Actions",
      width: 150,
      headerSort: false,
      hozAlign: "center",
      formatter: function (cell) {
        const d = cell.getRow().getData();
        const container = document.createElement("div");
        container.className = "d-flex gap-2";

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-sm btn-primary";
        editBtn.innerHTML = `<i class="fas fa-pen"></i>`;
        editBtn.onclick = () => openModal('edit', d);

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-outline-danger";
        delBtn.innerHTML = `<i class="fas fa-trash"></i>`;
        delBtn.onclick = () => handleDelete(d.uom_id);

        container.appendChild(editBtn);
        container.appendChild(delBtn);
        return container;
      }
    }
  ];

  useEffect(() => {
    tabulatorRef.current = new Tabulator(tableRef.current, {
      layout: "fitColumns",
      height: "500px",
      pagination: true,
      paginationMode: "remote",
      paginationSize: 20,
      ajaxURL: `${API_BASE}api/product_api/api/uom`,
      ajaxRequestFunc: async function (url, config, params) {
        const query = new URLSearchParams({
          ...params,
          q: document.getElementById("filter_uom_name")?.value || "",
        }).toString();
        return await apiFetch(`${url}?${query}`, { credentials: "include" });
      },
      ajaxResponse: function (url, params, response) {
        return {
          data: response.data || [],
          last_page: response.last_page || 1,
        };
      },
      columns: columns,
    });
    return () => tabulatorRef.current?.destroy();
  }, []);

  return (
    <div className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0 fw-bold">Unit of Measurement</h3>
        <button className="btn btn-dark" onClick={() => openModal('add')}>
          <i className="fas fa-plus me-2"></i>Add Unit
        </button>
      </div>

      <div className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-bold">Search Unit</label>
              <input id="filter_uom_name" className="form-control" placeholder="Search by name..." />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary px-4 me-2" onClick={() => tabulatorRef.current.setPage(1)}>Filter</button>
              <button className="btn btn-light px-4" onClick={() => { document.getElementById("filter_uom_name").value = ""; tabulatorRef.current.setPage(1); }}>Clear</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div ref={tableRef} />
      </div>

      {modalConfig.show && (
        <UOMModal 
          mode={modalConfig.mode} 
          initialData={modalConfig.initialData}
          onClose={closeModal}
          onRefresh={refreshTable}
        />
      )}
    </div>
  );
};

export default UnitOfMeasurement;