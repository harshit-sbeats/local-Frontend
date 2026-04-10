import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_BASE } from "../../../Config/api";
import formatCurrency, { formattedDate } from "../../../Utils/utilFunctions";
import InvoiceModel from "./NewInvoiceModel";
import Swal from "sweetalert2";

const statusConfig = {
  1: { label: "Paid", color: "success" },
  2: { label: "Unpaid", color: "danger" },
  3: { label: "Cancelled", color: "secondary" },
  4: { label: "On Hold", color: "warning" },
};

const InvoiceTab = ({ poId, reloadPO, preferredPaymentId, onSuccess, isCompleted }) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  const loadData = () => {
    setLoading(true);

    fetch(
      `${API_BASE}api/purchaseorder/api/purchase-order/get_invoice_rows/${poId}`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) {
          setInvoiceData(json.data);
        }
      })
      .catch(() => toast.error("Failed to load invoice details"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (poId) loadData();
  }, [poId]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (invoice) => {
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
          `${API_BASE}api/purchaseorder/api/purchase-order/delete_invoice/${invoice.po_invoice_id}`,
          { method: "DELETE" }
        );

        Swal.fire("Deleted!", "Invoice has been deleted.", "success");

        // Refresh without reloading page
        loadData();
      } catch (error) {
        Swal.fire("Error", "Failed to delete invoice.", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary spinner-border-sm" />
      </div>
    );

  return (
    <div className="p-3 bg-light min-vh-100">
      {/* Table Section */}
      {invoiceData && invoiceData.length > 0 ? (
        <div className="table-responsive bg-white shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Invoice No</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Payment Term</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoiceData.map((data) => (
                <tr key={data.po_invoice_id}>
                  <td className="fw-semibold">
                    {data.invoice_number}
                  </td>

                  <td>{formatCurrency(data.invoice_amount)}</td>

                  <td>
                    <span
                      className={`badge rounded-pill px-3 
                      bg-${
                        statusConfig[data.payment_status_id]?.color ||
                        "secondary"
                      } text-white`}
                    >
                      {statusConfig[data.payment_status_id]?.label ||
                        "Unknown"}
                    </span>
                  </td>

                  <td>{formattedDate(data.invoice_date)}</td>

                  <td>{formattedDate(data.due_date)}</td>

                  <td>{data.payment_term_name}</td>

                  <td className="text-end">
                      <button
                        onClick={() => !isCompleted && setEditInvoice(data)}
                        className="btn btn-sm btn-outline-info me-2"
                        disabled={isCompleted}
                        style={isCompleted ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                      >
                        <i className="fa fa-pen-alt"></i>
                      </button>

                      <button
                        onClick={() => !isCompleted && handleDelete(data)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={isCompleted}
                        style={isCompleted ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5 bg-white shadow-sm border rounded">
          <i className="fa fa-file-invoice fa-3x text-muted mb-3"></i>
          <h5 className="text-secondary fw-bold">
            No invoice records found
          </h5>
          <p className="text-muted small">
            There are no products or invoice details available for this
            order.
          </p>
        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <InvoiceModel 
          preferredPaymentId={preferredPaymentId}
          setShowModal={setShowModal}
          poId={poId}
          onSuccess={() => {        // ← loadData() மட்டும்
            loadData();
            setEditInvoice(null);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editInvoice && (
        <InvoiceModel 
          preferredPaymentId={preferredPaymentId}
          setShowModal={() => setEditInvoice(null)}
          editData={{ ...editInvoice, id: editInvoice.po_invoice_id }}
          poId={poId}
          onSuccess={onSuccess}  // 👈
        />
      )}
    </div>
  );
};

export default InvoiceTab;