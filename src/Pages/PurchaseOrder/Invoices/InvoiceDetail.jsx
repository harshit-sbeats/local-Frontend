import React, { useEffect, useState } from "react";
import { API_BASE } from "../../../Config/api";
import { apiFetch } from "../../../Utils/apiFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import StickyHeader from "../../../Components/Common/StickyHeader";

import { faListUl, faReceipt, faTruck } from '@fortawesome/free-solid-svg-icons';
import formatCurrency, { formattedDate } from "../../../Utils/utilFunctions";
import moment from 'moment';

const statusConfig = {
  1: { label: "Paid", color: "success" },
  2: { label: "Unpaid", color: "danger" },
  3: { label: "Cancelled", color: "secondary" },
  4: { label: "On Hold", color: "warning" },
};

const InvoiceDetail = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const fetchInvoiceDetail = async (invoiceId) => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `${API_BASE}api/purchaseorder/api/purchase-order/invoices/details/view/${invoiceId}`
      );
      if (res) {
        setData(res.data || {});
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceDetail(invoiceId);
  }, [invoiceId]);

  if (loading) return (
    <div className="p-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">Loading Invoice details...</p>
    </div>
  );

  return (
    <>
      <div className="mt-3">
        <StickyHeader>
          <div className="d-flex justify-content-between align-items-center mt-0 mb-2 px-2">
            <div>
              <h5 className="fw-bold mb-0">Invoice #: {data.invoice_number || "---"}</h5>
              <div className="text-muted small mt-2">
                Created by <strong>{data.created_by || "System"}</strong> On {data.created_at ? moment.utc(data.created_at).local().format('DD MMM YYYY hh:mm A') : '---'}
              </div>
            </div>
            <button className="btn btn-outline-primary shadow-sm" onClick={() => navigate("/po/invoices")}>
              <FontAwesomeIcon className="me-1" icon={faListUl} /> Listing
            </button>
          </div>
        </StickyHeader>

        <div className="bg-white rounded shadow-sm border mt-3">
          {/* Main Info Row */}
          <div className="row g-0 p-4">
            
            {/* Column 1: Primary Invoice Metadata */}
            <div className="col-lg-4 border-end pe-4">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">General Information</h6>
              <div className="row g-2">
                <div className="col-6 text-sm fw-bold text-secondary">PO:</div>
                <div className="col-6 text-sm ps-4">{data.po_number || "--"}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Order Number:</div>
                <div className="col-6 text-sm ps-4">{data.order_no || "--"}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Order Date:</div>
                <div className="col-6 text-sm ps-4">{formattedDate(data.order_date)}</div>

                <div className="col-6 text-sm fw-bold text-secondary">Payment Type:</div>
                <div className="col-6 text-sm ps-4 text-primary">{data.payment_term_name || "--"}</div>
                
                <div className="col-6 mt-3 text-sm fw-bold text-black">Status:</div>
                <div className="col-6 mt-3  text-md">
                  <span className={`badge rounded-pill px-3 py-2 border 
                    bg-${statusConfig[data.payment_status_id]?.color || 'dark'}-soft 
                    text-${statusConfig[data.payment_status_id]?.color || 'dark'} 
                    border-${statusConfig[data.payment_status_id]?.color || 'dark'}`}
                  >
                    {statusConfig[data.payment_status_id]?.label || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Billing & Timeline */}
            <div className="col-lg-4 border-end px-4">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Billing & Timeline</h6>
              <div className="bg-light p-3 rounded-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-sm text-secondary">Invoice Date:</span>
                  <span className="text-sm fw-bold">{formattedDate(data.invoice_date)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-sm text-secondary">Due Date:</span>
                  <span className="text-sm fw-bold text-danger">
                    {data.due_date ? formattedDate(data.due_date) : "--"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-sm text-secondary">Paid Date:</span>
                  <span className="text-sm fw-bold">{data.paid_date ? formattedDate(data.paid_date) : "--"}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="fw-bold">Total Amount:</span>
                  <span className="fw-bold text-primary h5 mb-0">{formatCurrency(data.invoice_amount)}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Addresses */}
            <div className="col-lg-4 ps-4">
              <div className="row g-4">
                {/* Billing Address */}
                <div className="col-12">
                  <h6 className="text-uppercase text-muted small fw-bold mb-2">
                    <FontAwesomeIcon icon={faReceipt} className="me-2 text-xs" /> Billing Address
                  </h6>
                  <div className="text-sm text-dark ps-1">
                    <strong className="d-block mb-1">{data.billing?.delivery_name || "N/A"}</strong>
                    {data.billing?.address_line1 && <>{data.billing.address_line1} <br/></>}
                    {data.billing?.address_line2 && <>{data.billing.address_line2}, </>}
                    {data.billing?.city ? `${data.billing.city}, ` : ""}
                    {data.billing?.state_name ? `${data.billing.state_name} - ` : ""}
                    {data.billing?.zip}
                    <div className="text-muted">{data.billing?.country_name}</div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="col-12 border-top pt-3">
                  <h6 className="text-uppercase text-muted small fw-bold mb-2">
                    <FontAwesomeIcon icon={faTruck} className="me-2 text-xs" /> Shipping Address
                  </h6>
                  <div className="text-sm text-dark ps-1">
                    <strong className="d-block mb-1">{data.shipping?.delivery_name || "N/A"}</strong>
                    {data.shipping?.address_line1 && <>{data.shipping.address_line1} <br/></>}
                    {data.shipping?.address_line2 && <>{data.shipping.address_line2}, </>}
                    {data.shipping?.city ? `${data.shipping.city}, ` : ""}
                    {data.shipping?.state_name ? `${data.shipping.state_name} - ` : ""}
                    {data.shipping?.zip}
                    <div className="text-muted">{data.shipping?.country_name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive p-0 border-top">
            <table className="table table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Item Description</th>
                  <th>QTY</th>
                  <th>Unit Price</th>
                  <th className="pe-4 text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.lineitems?.length > 0 ? (
                  data.lineitems.map((row) => (
                    <tr key={row.id}>
                      <td className="ps-4">
                        <h6 className="mb-0 fw-bold">{row.product_title}</h6>
                        <small className="text-muted">{row.sku}</small>
                      </td>
                      <td>{row.received_qty}</td>
                      <td>{formatCurrency(row.unit_cost)}</td>
                      <td className="pe-4 text-end fw-bold">{formatCurrency(row.line_amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-5 text-muted">
                      No line items found for this invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetail;