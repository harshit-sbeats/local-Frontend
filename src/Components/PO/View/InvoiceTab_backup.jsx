import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_BASE, API_ENDPOINTS } from "../../../Config/api";
import formatCurrency, { formattedDate } from "../../../Utils/utilFunctions";
import InvoiceModel from "./NewInvoiceModel";
import Swal from "sweetalert2";

const statusConfig = {
  1: { label: "Paid", color: "success" },
  2: { label: "Not Paid", color: "danger" },
  3: { label: "Cancelled", color: "secondary" },
  4: { label: "On Hold", color: "warning" },
};

const InvoiceTab = ({ poId }) => {

  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  
 
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
 
  const loadData = () => {
    setLoading(true);
    fetch(`${API_BASE}api/purchaseorder/api/purchase-order/get_invoice_rows/${poId}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) setInvoiceData(json.data);
      })
      .catch(() => toast.error("Failed to load invoice details"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (poId){ loadData();} }, [poId]);

  const handleDeleteInvoice = async () => {
    const params = new URLSearchParams();
    params.append("po_invoice_id", selectedInvoiceId);
    const payload = {
        po_id: poId,
        po_invoice_id: selectedInvoiceId,
    };

    try {
      const response = await apiFetch(
        API_ENDPOINTS.delete_purchase_invocies,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
        
    if (response.status) {
        toast.success("Invoice deleted");
        setShowDeleteConfirm(false);
        loadData();
      }else
        toast.error("Delete failed");

    } catch (error) { toast.error("Delete failed"); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary spinner-border-sm" /></div>;

  return (
    <div className="p-3 bg-light min-vh-100">
      {/* Check if invoiceData exists and has data */}
      
      <div  className="border-0">
        <div className="card-body p-0">

      {invoiceData && invoiceData.length > 0 ? (
        invoiceData.map((data) => (
            <InvoiceRow data={data} />
          ))
      ) : (
        /* NO RECORDS FOUND VIEW */
        <div className="text-center py-5 bg-white shadow-sm border rounded">
          <i className="fa fa-file-invoice fa-3x text-muted mb-3"></i>
          <h5 className="text-secondary fw-bold">No invoice records found</h5>
          <p className="text-muted small">There are no products or invoice details available for this order.</p>
        </div>
      )}

      {/* --- ADD INVOICE MODAL --- */}
      {showModal && (
        <InvoiceModel setShowModal={setShowModal} poId={poId} />
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {showDeleteConfirm && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
              <div className="modal-content border-0 shadow text-center p-4">
                <h3 className="fw-bold mb-3">Are you sure?</h3>
                <p className="text-muted">This invoice record will be permanently deleted!</p>
                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button className="btn btn-secondary px-4" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button className="btn btn-danger px-4" onClick={handleDeleteInvoice}>Yes, delete it!</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      </div>
    </div>
  </div>
);
};

const InvoiceRow = ({ data, onDelete }) => {

  const [showEditModel, setShowEditModel] = useState(false);

  const handleEdit = () => {
    setShowEditModel(true);
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This invoice will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(
          `${API_BASE}api/purchaseorder/api/purchase-order/delete_invoice/${data.po_invoice_id}`,
          {
            method: "DELETE",
          }
        );

        Swal.fire("Deleted!", "Invoice has been deleted.", "success");

        // Remove from parent state (recommended)
        if (onDelete) {
          onDelete(data.po_invoice_id);
        }
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch (error) {
        Swal.fire("Error", "Failed to delete invoice.", "error");
      }
    }
  };

  return (
    <div className="row">
      <div className="card mb-4 shadow-sm border">
        <div className="card-body p-2 pt-3 pb-3 mb-3">

          {/*  Top Action Row */}
          <div className="d-flex justify-content-end mb-2">
            <button
              onClick={handleEdit}
              className="btn btn-sm btn-outline-info me-2 pe-2"
            >
              <i className="fa fa-pen-alt me-1"></i> Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-sm btn-outline-danger"
            >
              <i className="fa fa-trash  me-1"></i> Delete
            </button>
          </div>

          {/* Invoice Header Details */}
          <div className="row g-3 mt-1">

            {/* Column 1 */}
            <div className="col-lg-4">
              <div className="row g-2">
                <div className="col-6 text-sm fw-bold text-secondary">Invoice Number:</div>
                <div className="col-6 text-sm">
                  <h6 className="fw-bold">{data.invoice_number}</h6>
                </div>

                <div className="col-6 text-sm fw-bold text-secondary">Amount:</div>
                <div className="col-6 text-sm">{formatCurrency(data.amount)}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Received QTY:</div>
                <div className="col-6 text-sm text-primary">{data.received_qty}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Payment Status:</div>
                <div className="col-6">
                  <span
                    className={`badge rounded-pill px-3 border 
                      bg-${statusConfig[data.payment_status_id]?.color || "dark"}-soft 
                      text-${statusConfig[data.payment_status_id]?.color || "dark"} 
                      border-${statusConfig[data.payment_status_id]?.color || "dark"}`}
                  >
                    {statusConfig[data.payment_status_id]?.label || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="col-lg-4">
              <div className="row g-2">
                <div className="col-6 text-sm fw-bold text-secondary">Order Date:</div>
                <div className="col-6 text-sm">{formattedDate(data.order_date)}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Order No:</div>
                <div className="col-6 text-sm">{data.order_no}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Vendor Ref:</div>
                <div className="col-6 text-sm text-primary">{data.vendor_ref_no}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Delivery Ref:</div>
                <div className="col-6 text-sm text-primary">{data.delivery_ref}</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="col-lg-4">
              <div className="row g-2">
                <div className="col-6 text-sm fw-bold text-secondary">Invoice Date:</div>
                <div className="col-6 text-sm">{formattedDate(data.invoice_date)}</div>
                <div className="col-6 text-sm fw-bold text-secondary">Due Date:</div>
                <div className="col-6 text-sm">{formattedDate(data.due_date)}</div>
                <div className="col-6 text-sm fw-bold text-secondary">Paid Date:</div>
                <div className="col-6 text-sm text-primary">{formattedDate(data.paid_date)}</div>
                <div className="col-6 text-sm fw-bold text-secondary">Payment Term:</div>
                <div className="col-6 text-sm text-primary">{data.payment_term_name}</div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="row mt-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Item Description</th>
                  <th>QTY</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.line_items && data.line_items.length > 0 ? (
                  data.line_items.map((product) => (
                    <tr key={product.product_id}>
                      <td className="align-middle">
                        <div className="fw-bold">{product.product_name}</div>
                        <div className="text-muted small">
                          SKU: {product.sku}
                        </div>
                      </td>
                      <td className="align-middle">{product.received_qty}</td>
                      <td className="align-middle">
                        {formatCurrency(product.unit_cost)}
                      </td>
                      <td className="align-middle">
                        {formatCurrency(product.line_amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showEditModel && (
            <InvoiceModel
              setShowModal={setShowEditModel}
              editData={{
                ...data,
                id: data.po_invoice_id, // Map your ID field
                items: data.line_items?.map(li => ({
                  ...li,
                  // Ensure unit cost matches the name in your modal's landed_cost variable
                  landed_cost_per_unit_incl_gst: li.unit_cost, 
                  title: li.product_name,
                  qty: li.ordered_qty || li.received_qty // Fallback if ordered qty isn't in line_items
                }))
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default InvoiceTab;