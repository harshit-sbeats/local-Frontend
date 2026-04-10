import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_BASE } from "../../../Config/api";
import formatCurrency, { formatAUD, formattedDate } from "../../../Utils/utilFunctions";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const statusConfig = {
  1: { label: "Paid", color: "success" },
  2: { label: "Unpaid", color: "danger" },
  3: { label: "Cancelled", color: "secondary" },
  4: { label: "On Hold", color: "warning" },
};

const WarehouseTab = ({ poId, reloadPO, onSuccess }) => {
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  const [lineItems, setLineItems] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  const loadData = () => {
    setLoading(true);

    fetch(
      `${API_BASE}api/purchaseorder/api/purchase-order/get_all_receipts/${poId}`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) {
          setLineItems(json.data);
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
      {lineItems && lineItems.length > 0 ? (
        <div className="table-responsive bg-white shadow-sm rounded">
            <table className="table table-hover align-middle mb-0" >
              <thead className="table-light">
                <tr>
                    <th className="align-middle" style={{minWidth:"30px"}}>SL.No</th>
                    <th className="align-middle" style={{minWidth:"115px"}}>Invoice Number</th>
                    <th className="align-middle">Product Detail</th>
                    <th className="align-middle" style={{minWidth:"104px"}}>Price (Ex GST)</th>
                    <th className="align-middle" style={{minWidth:"98px"}}>Discount (%)</th>
                    <th className="align-middle" style={{minWidth:"110px"}}>Discount Price</th>
                    <th className="align-middle" style={{minWidth:"85px"}}>Line Total</th>
                    <th className="align-middle" style={{minWidth:"80px"}}>GST Rate</th>
                    <th className="align-middle" style={{minWidth:"105px"}}>Received Date</th>
                    <th className="align-middle" style={{minWidth:"110px"}}>Comment</th>
                    <th className="align-middle" style={{minWidth:"100px"}}>QTY Ordered</th>
                    <th className="align-middle text-end" style={{minWidth:"105px"}}>Receipt QTY</th>
                </tr>
                </thead>
                <tbody>
                {lineItems.length === 0 ? (
                    <tr><td colSpan="13" className="text-center">No records found</td></tr>
                ) : (
                    lineItems.map((item, i) => (
                        <React.Fragment key={item.product_id}>
                        <tr>
                            {/* 1. Line */}
                        
                            <td className="align-middle">{i + 1}</td>

                            {/* 2. Invoice Number */}
                            <td className="align-middle">
                                  {JSON.stringify(item.items)}
                                {item.invoice_number || "-"}
                            </td>

                            {/* 3. Product Detail */}
                            <td style={{ minWidth: "220px" }}>
                            <Tippy
                                content={
                                <div style={{ maxWidth: "300px" }}>
                                    <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                                    {item.comment || "No comment"}
                                    </div>
                                </div>
                                }
                                interactive={true}
                                theme="custom-gray"
                                delay={[200, 200]}
                                placement="top"
                            >
                                <div className="d-flex align-items-start gap-3">
                                <div className="flex-grow-1">
                                    <span className="fw-bold d-block">{item.product_title}</span>
                                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                                    SKU: {item.product_sku} | ASIN: {item.product_asin}
                                    </div>
                                </div>
                                </div>
                            </Tippy>
                            </td>

                            {/* 4. Price (Ex GST) - Numeric/Currency */}
                            <td className="align-middle text-end">{formatAUD(item.price)}</td>

                            {/* 5. Discount (%) - Numeric */}
                            <td className="align-middle text-end">{item.discount}%</td>

                            {/* 6. Discount Price - Currency */}
                            <td className="align-middle text-end">{formatCurrency(item.discount_price)}</td>

                            {/* 7. Line Total - Currency */}
                            <td className="align-middle text-end">{formatCurrency(item.line_total)}</td>

                            {/* 8. GST Rate - Numeric */}
                            <td className="align-middle text-end" >{item.gst_rate}%</td>

                            {/* 9. Receipt Date - Left Aligned (Default) */}
                            <td className="align-middle">
                                {formattedDate(item.received_date) || "-"}
                            </td>

                            {/* 10. Comment - Left Aligned (Text) */}
                            <td className="align-middle" style={{ cursor: "pointer", maxWidth: "150px" }}>
                                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                                    {item.comment || "-"}
                                </span>
                            </td>

                            {/* 11. QTY Ordered - Numeric */}
                            <td className="align-middle text-end" >{item.qty_ordered}</td>

                            {/* 12. Receipt QTY - Numeric */}
                            <td className="align-middle text-end" >
                                {item.receipt_qty}
                            </td>

                        </tr>
                        </React.Fragment>
                    ))
                )}
                </tbody>
            </table>
          </div>
      ) : (
        <div className="text-center py-5 bg-white shadow-sm border rounded">
          <i className="fa fa-file-invoice fa-3x text-muted mb-3"></i>
          <h5 className="text-secondary fw-bold">
            No Receive records found
          </h5>
          <p className="text-muted small">
            There are no products details available for this order.
          </p>
        </div>
      )}
    </div>
  );
};

export default WarehouseTab;