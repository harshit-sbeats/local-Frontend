import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ShippingTab from "../../Components/PO/View/ShippingTab";
import InvoiceTab from "../../Components/PO/View/InvoiceTab";
import { apiFetch } from "../../Utils/apiFetch";
import { API_ENDPOINTS } from "../../Config/api";
import { Spinner, Button } from 'react-bootstrap';
import formatCurrency, { formatAUD, formattedDate } from "../../Utils/utilFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import WarehouseTab from "../../Components/PO/Tabs/WarehouseTab";

const getPOStatusBadge = (status) => {
  let text = "Unknown", badge = "badge-info";
  if (status === -1) { text = "Draft";      badge = "badge-secondary"; }
  else if (status === 0) { text = "Parked"; badge = "badge-warning"; }
  else if (status === 1) { text = "Placed"; badge = "badge-primary bg-primary"; }
  else if (status === 2) { text = "Costed"; badge = "badge-info bg-info"; }
  else if (status === 3) { text = "Receipted"; badge = "badge-success bg-success"; }
  else if (status === 4) { text = "Completed"; badge = "badge-success bg-success"; }
  return (
    <span className={`badge rounded-pill ${badge} py-2 px-3`}>
      <i className="fa fa-bolt me-1" />{text.toUpperCase()}
    </span>
  );
};

const PurchaseOrderView = () => {
  const { poId }    = useParams();
  const navigate    = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading]                         = useState(true);
  const [po, setPo]                                   = useState(null);
  const [vendor, setVendor]                           = useState({});
  const [warehouse, setWarehouse]                     = useState({});
  const [vendorOrders, setVendorOrders]               = useState([]);
  const [lineItems, setLineItems]                     = useState([]);
  const [surcharge, setSurcharge]                     = useState(0);
  const [freight, setFreight]                         = useState(0);
  const [preferredShippingProvider, setPreferredShippingProvider] = useState(null);

  const activeTab = searchParams.get("tab") || "products";
  const handleTabClick = (tabId) => setSearchParams({ tab: tabId });

  const approve_and_create_receive = async () => {
    try {
      const response = await apiFetch(
        API_ENDPOINTS.approve_purchase_order + `${poId}`,
        { method: "POST", body: JSON.stringify({ po_id: poId }) }
      );
      if (response.status && response.po_receive_id) {
        toast.success("PO Receive created successfully");
        navigate(0);
      } else {
        toast.error(response.message || "Error opening receive details");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const fetchPoDetails = async () => {
    try {
      setLoading(true);
      const json = await apiFetch(API_ENDPOINTS.get_po_details + `${poId}`);

      if (!json?.status) { toast.error("Invalid Purchase Order"); return; }

      const d = json.data;
      const p = d.po;

      setPreferredShippingProvider(d.preferred_shipping_provider);
      setPo(p);

      if (!d.receive_generated && p.status_id === 1) {
        approve_and_create_receive();
      }

      setSurcharge(Number(p.surcharge_total || 0));
      setFreight(Number(p.shipping_charge || 0));

      setVendor({ code: p.vendor_code, name: p.vendor_name, currency: p.currency_code });
      setWarehouse({
        name: p.po_delivery_name,
        address: `${p.po_address_line1 || ""} ${p.po_address_line2 || ""}`.trim(),
        city: p.po_city, state_name: p.po_state, zip: p.po_zip, country: p.po_country,
      });

      if (Array.isArray(d.po_vendor_details)) setVendorOrders(d.po_vendor_details);

      if (Array.isArray(d.line_items)) {
        const mapped = d.line_items.map((li) => ({
          product_id:          li.row_item.id,
          title:               li.row_item.title,
          sku:                 li.row_item.sku,
          asin:                li.row_item.asin,
          fnsku:               li.row_item.fnsku,
          ean:                 li.row_item.ean,
          prep_type:           li.row_item.prep_type,
          is_taxfree:          !!li.row_item.is_taxfree,
          image:               li.row_item.image,
          quantity:            Number(li.qty || 0),
          price:               Number(li.price || 0),
          discount:            Number(li.discount || 0),
          sub_total:           Number(li.sub_total || 0),
          gst_percent:         Number(li.tax || 0),
          gst_amount:          Number(li.tax_amount || 0),
          total:               Number(li.line_total || 0),
          landed_cost_ex_gst:  Number(li.landed_cost_ex_gst || 0),
          landed_cost_inc_gst: Number(li.landed_cost_inc_gst || 0),
          landed_total_ex_gst:  Number(li.landed_cost_ex_gst || 0),
          landed_total_inc_gst: Number(li.landed_cost_inc_gst || 0),
        }));
        setLineItems(mapped);
      }
    } catch (error) {
      console.error("Failed to load PO:", error);
      toast.error(error?.message || "Something went wrong while loading PO");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (poId) fetchPoDetails(); }, [poId]);

  const refreshPO = () => fetchPoDetails();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!po || !po?.po_number) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '80vh' }}>
        <div className="text-center p-5 shadow-sm bg-white rounded-4" style={{ maxWidth: '450px' }}>
          <div className="mb-4">
            <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="fw-bold text-dark">PO Not Found</h3>
          <p className="text-muted mb-4">
            We couldn't find the PO details you're looking for. The ID might be invalid or the PO may have been deleted.
          </p>
          <div className="d-grid gap-2">
            <Button variant="dark" className="py-2 fw-bold shadow-sm" onClick={() => navigate('/purchaseorder/listing')}>
              <i className="fas fa-arrow-left me-2"></i>Back to List
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt me-2"></i>Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* Totals */
  const totalQty     = lineItems.reduce((s, i) => s + i.quantity, 0);
  const subTotal     = lineItems.reduce((s, i) => s + i.sub_total, 0);
  const productGST   = lineItems.reduce((s, i) => s + i.gst_amount, 0);
  const freightGST   = freight * 0.10;
  const surchargeGST = surcharge * 0.10;
  const gstTotal     = productGST + freightGST + surchargeGST;
  const grandTotal   = subTotal + gstTotal + freight + surcharge;

  /* Payment balance — grandTotal vs paid */
  const balance  = grandTotal - Number(po.invoice_paid || 0);
  const isCredit = balance < 0;

  const primaryVendorOrder = vendorOrders?.find(v => v.is_primary === 1);

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light back-btn rounded-circle" onClick={() => navigate('/purchaseorder/listing')}>
            <i className="fa fa-chevron-left" />
          </button>
          <h4 className="mb-0 fw-bold">SB PO Number {po?.po_number}</h4>
          {getPOStatusBadge(po?.status_id)}
        </div>
        <div className="d-flex gap-2 align-items-center">
          <a type="button" className="btn btn-outline-primary shadow-sm" href={`/purchaseorder/create/${poId}/`}>
            <i className="fa fa-pen me-1 text-sm" /> Edit
          </a>
          <div className="dropdown d-inline-block">
            <button type="button" className="btn btn-link p-0 more-btn" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-ellipsis-h text-muted"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li style={{ opacity: "0.5" }}>
                <a style={{ pointerEvents: "none" }} className="dropdown-item" disabled>
                  <i className="fas fa-trash me-1"></i> Delete
                </a>
              </li>
              <li style={{ opacity: "0.5" }}>
                <a disabled style={{ pointerEvents: "none" }} className="dropdown-item">
                  <i className="fas fa-print me-1"></i> Print
                </a>
              </li>
              <li style={{ opacity: "0.5" }}>
                <button type="button" className="dropdown-item" disabled>
                  <i className="fa fa-download me-1"></i> Export
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between text-muted ps-3 pe-3 mt-2 small mb-3">
        <span>Created by <strong>{po.created_by_name}</strong> · <i className="fa fa-box ml-2 mr-1 text-secondary"></i> {totalQty} Products</span>
        <span>Order created {po.created_at ? moment.utc(po.created_at).local().format('DD MMM YYYY hh:mm A') : '---'}</span>
      </div>

      {/* Vendor / Warehouse Card */}
      <div className="row">
        <div className="col-md-9 col-sx-12">
          <div className="card card-custom mb-3 shadow-sm">
            <div className="">
              <div className="card-header p-2 d-flex align-items-center">
                <div className="mb-2 user-block help-text d-flex align-items-center" title="Vendor Details">
                  <div id="avatarBox" className="avatar-circle user-avatar me-2">
                    {vendor.name?.charAt(0)}
                  </div>
                  <div>
                    <span className="username ms-3 mb-1 d-block">
                      <Link to={`/vendor/editvendor/${po.vendor_id}`} target="_blank">{vendor.code}</Link>
                    </span>
                    <span className="description ms-3 text-muted">{vendor.name}</span>
                  </div>
                </div>
                <div className="btn-soft-wrap d-flex gap-2 ms-auto">
                  <div className="justify-content-end">
                    <button type="button" className="btn btn-light btn-soft" disabled>
                      <i className="fa fa-paperclip me-1"></i> Attachments
                    </button>
                    <button type="button" className="btn btn-light btn-soft" disabled>
                      <i className="fa fa-envelope me-1"></i> Send Email
                    </button>
                    <button className="btn btn-light btn-soft" disabled>
                      <i className="fa fa-phone me-1"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body row">
                <div className="col-md-4">
                  <div><b>Vendor Code:</b> {vendor.code}</div>
                  <div><b>Vendor Name:</b> {vendor.name}</div>
                  <div><b>Currency Code:</b> {vendor.currency}</div>
                  <div><b>SBPO Order Date:</b> {formattedDate(po.sbpo_order_date)}</div>
                </div>
                <div className="col-md-4 invoice-col">
                  <b><i className="fa fa-map-marker-alt me-1" /> Warehouse</b>
                  <div className="text-muted">{warehouse.name}</div>
                  <div className="mt-3">
                    <b><i className="far fa-file-alt mr-2" />Vendor Payment Term</b>
                    <div className="text-muted">{po.vendor_payment_term_name}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="fw-bold mb-1">Vendor PO Details:</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                    <div className="d-flex">
                      <b style={{ width: '100px', display: 'inline-block' }}>PO#:</b>
                      <span className="text-muted">{primaryVendorOrder?.vendor_po_number || "--"}</span>
                    </div>
                    <div className="d-flex">
                      <b style={{ width: '100px', display: 'inline-block' }}>Order Date:</b>
                      <span className="text-muted">
                        {primaryVendorOrder?.order_date ? formattedDate(primaryVendorOrder.order_date) : "--"}
                      </span>
                    </div>
                    <div className="d-flex">
                      <b style={{ width: '100px', display: 'inline-block' }}>Order No:</b>
                      <span className="text-muted">{primaryVendorOrder?.order_number || "--"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded p-3 mt-2">
                <div className="fw-bold">{po.po_delivery_name}</div>
                <div className="text-muted">
                  {po.po_address_line1}, {po.po_address_line2}, {po.po_city}, {po.po_state_name} {po.po_zip}, {po.po_country_name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-3 col-md-3 col-xs-12">
          <div className="card border-0 shadow-sm rounded-lg overflow-hidden" style={{ minWidth: '280px' }}>
            <div className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom">
              <h6 className="mb-0 font-weight-bold text-secondary small" style={{ letterSpacing: '0.5px' }}>
                PAYMENT DETAILS
              </h6>
            </div>
            <div className="card-body p-4">
              <div className="mb-3 text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: '60px', height: '36px' }}>
                  <FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" className="text-primary" />
                </div>
                <h2 className="font-weight-bold mb-0 text-dark">{formatCurrency(po.invoice_total)}</h2>
                <p className="text-muted small text-uppercase font-weight-bold">Invoice Total</p>
              </div>
              <hr className="my-2" style={{ opacity: 0.1 }} />
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success mr-2" />
                  <span className="text-muted small">Paid Amount</span>
                </div>
                <span className="font-weight-bold text-dark">{formatCurrency(po.invoice_paid)}</span>
              </div>

              {/* ── Pending or Vendor Credit ── */}
              {isCredit ? (
                <div className="p-3 rounded" style={{ backgroundColor: '#f0fff4', borderLeft: '4px solid #28a745' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-success mr-2" />
                      <span className="text-success small font-weight-bold"> Credit</span>
                    </div>
                    <span className="font-weight-bold text-success">+{formatCurrency(Math.abs(balance))}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded" style={{ backgroundColor: '#fff5f5', borderLeft: '4px solid #dc3545' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faExclamationCircle} className="text-danger mr-2" />
                      <span className="text-danger small font-weight-bold">Pending</span>
                    </div>
                    <span className="font-weight-bold text-danger">{formatCurrency(balance)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <ul className="nav nav-tabs" role="tablist">
            {["products", "tracking", "invoice", "warehouse"].map((tab) => (
              <li className="nav-item" role="presentation" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => handleTabClick(tab)}
                  type="button"
                >
                  {tab === "products" ? "Products"
                   : tab === "tracking" ? "Tracking Details"
                   : tab === "invoice" ? "Invoice Details"
                   : "Warehouse Details"}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content mt-1">
            <div className={`tab-pane fade ${activeTab === "products" ? "show active" : ""}`}>
              <div className="productDetails p-2">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th className="align-middle" style={{ width: "35%" }}>ITEM DETAILS</th>
                        <th className="text-end align-middle">Qty</th>
                        <th className="text-end align-middle">Unit Price</th>
                        <th className="text-end align-middle">Sub Total</th>
                        <th className="text-end align-middle">GST</th>
                        <th className="text-end align-middle">Landed Cost<br />(Exc.GST)</th>
                        <th className="text-end align-middle">Landed Cost<br />(Inc.GST)</th>
                        <th className="text-end align-middle">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <div className="fw-bold">{item.title}</div>
                            <div className="text-muted small">SKU: {item.sku} · ASIN: {item.asin}</div>
                          </td>
                          <td className="text-end align-middle">{item.quantity}</td>
                          <td className="text-end align-middle">{formatAUD(item.price)}</td>
                          <td className="text-end align-middle">{formatAUD(item.sub_total)}</td>
                          <td className="text-end align-middle">{formatAUD(item.gst_amount)}</td>
                          <td className="text-end align-middle">{formatAUD(item.landed_total_ex_gst)}</td>
                          <td className="text-end align-middle">{formatAUD(item.landed_total_inc_gst)}</td>
                          <td className="text-end align-middle fw-bold">{formatAUD(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ps-4 pt-4 pb-4 d-flex justify-content-between">
                  <div style={{ width: "500px", height: "200px", overflow: "auto" }}>
                    {po.comments && (
                      <>
                        <label className="text-muted text-small mb-0">COMMENT</label><br />
                        <div className="mt-3" style={{ background: "#f8f9fa" }}>{po.comments}</div>
                      </>
                    )}
                  </div>
                  <table className="table table-borderless w-auto po-total-table">
                    <tbody>
                      <tr>
                        <td className="pb-1">Subtotal (Excl. GST)</td>
                        <td className="text-end pb-1">{formatAUD(subTotal)}</td>
                      </tr>
                      <tr>
                        <td className="pb-0 pt-1">Surcharge</td>
                        <td className="text-end pb-0 pt-1">{formatAUD(surcharge)}</td>
                      </tr>
                      <tr>
                        <td className="pb-0 pt-1">Freight</td>
                        <td className="text-end pb-0 pt-1">{formatAUD(freight)}</td>
                      </tr>
                      <tr>
                        <td>GST Total</td>
                        <td className="text-end">{formatAUD(gstTotal)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-success">Grand Total (Incl. GST)</td>
                        <td className="text-end fw-bold text-success">{formatAUD(grandTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={`tab-pane fade ${activeTab === "warehouse" ? "show active" : ""}`}>
              <WarehouseTab poId={poId} />
            </div>
            <div className={`tab-pane fade ${activeTab === "tracking" ? "show active" : ""}`}>
              <ShippingTab poId={poId} preferredShippingProvider={preferredShippingProvider} />
            </div>
            <div className={`tab-pane fade ${activeTab === "invoice" ? "show active" : ""}`}>
              <div id="section_all_invoice_details">
                <InvoiceTab
                  poId={poId}
                  reloadPO={refreshPO}
                  preferredPaymentId={po.vendor_payment_term_id}
                  onSuccess={fetchPoDetails}
                  isCompleted={po.status_id === 4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderView;