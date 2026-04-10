import React, { useState, useEffect } from "react";
import { Button, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { toast } from "react-hot-toast";
import { useMasterData } from "../../../../Context/MasterDataProvider";
import formatCurrency, { formattedDate } from "../../../../Utils/utilFunctions";
import SearchableSelect from "../../../../Components/Common/SearchableSelect";

const ReceiveOrderInfoSection = ({
  sbPoNumber, setSbPoNumber, vendors, selectedVendorId, handleVendorChange,
  vendorDetails, sbPoDate, setSbPoDate, warehouses, selectedWarehouse,
  handleWarehouseChange, deliveryForm, setDeliveryForm, states, countries,
  setSbPoDeliveryDate, sbPoDeliveryDate,
  glboalTaxRate, setGlobalTaxRate,
  globalDiscount, setGlobalDiscount,
  minOrderValue, setMinOrderValue,
  vendorOrders, setVendorOrders,
  poReceiveDetails, setPOReceiveDetails,
  poInvoices,
  newLineItemInvoiceId, setNewLineItemInvoiceId,
  lineItems,
  newLineItemProductId, setNewLineItemProductId,
  receivedLineItems, setReceivedLineItem,
  visible, setVisible,
  updateLineItem
}) => {
  const selectedProduct = lineItems.find(i => i.product_id === Number(newLineItemProductId));
  const [receivedQty, setReceivedQty] = useState("");

  useEffect(() => {
    if (selectedProduct) { setReceivedQty(selectedProduct.quantity || ""); }
    else { setReceivedQty(""); }
  }, [newLineItemProductId]);

  const fieldLabel = { fontSize:"11px", fontWeight:500, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.3px", marginBottom:"5px", display:"block" };
  const fieldVal = { fontSize:"13px", color:"#111827", background:"#f9fafb", border:"0.5px solid #e5e7eb", borderRadius:"8px", padding:"8px 12px" };

  return (
    <>
      {/* Order Information */}
      <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:"12px", marginBottom:"12px" }}>
        <div style={{ padding:"10px 16px", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.5px", background:"#f9fafb", borderBottom:"0.5px solid #e5e7eb", borderRadius:"12px 12px 0 0" }}>
          Order Information
        </div>
        <div className="row pb-2 p-2">

          <Col md={4} className="px-4 py-3">
            <FormGroup className="mb-3">
              <span style={fieldLabel}>Vendor Code and Name</span>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ fontSize:"13px", background:"#f3f4f6", border:"0.5px solid #e5e7eb", color:"#374151", fontWeight:600 }}>
                    {vendors.find(w => w.id === selectedVendorId)?.vendor_code || ""}
                  </span>
                </div>
                <input type="text" className="form-control" style={{ fontSize:"13px", border:"0.5px solid #e5e7eb", background:"#f9fafb" }} value={vendorDetails.name} disabled />
              </div>
            </FormGroup>
            <FormGroup className="mb-3">
              <span style={fieldLabel}>Invoice Number <span style={{ color:"#ef4444" }}>*</span></span>
              <Row>
                <div className="col-11 ps-1 float-start">
                  <SearchableSelect
                    options={poInvoices}
                    value={newLineItemInvoiceId || ""}
                    onChange={e => { if (!newLineItemInvoiceId) setNewLineItemInvoiceId(e.target.value); }}
                    labelKey="invoice_number" valueKey="po_invoice_id" displayKey="invoice_number"
                    placeholder="Select/Search Invoice"
                    disabled={!!newLineItemInvoiceId}
                  />
                </div>
                <div className="col-1 pt-0 pe-0 float-start d-flex align-items-center justify-content-center">
                  <i className="fas fa-search" style={{ color:"#9ca3af", fontSize:"12px" }}></i>
                </div>
              </Row>
            </FormGroup>
          </Col>

          <Col md={4} className="px-4 py-3">
            <FormGroup className="mb-3">
              <span style={fieldLabel}>Currency Code</span>
              <div style={fieldVal}>{vendorDetails.currency || "—"}</div>
            </FormGroup>
            <FormGroup className="mb-3">
              <span style={fieldLabel}>SB Warehouse</span>
              <div style={fieldVal}>{warehouses.find(w => w.id === selectedWarehouse?.id)?.name || "—"}</div>
            </FormGroup>
          </Col>

          <Col md={4} className="px-4 py-3">
            <FormGroup className="mb-3">
              <span style={fieldLabel}>SBPO Order Date</span>
              <div style={fieldVal}>{sbPoDate ? new Date(sbPoDate).toLocaleDateString("en-AU") : "—"}</div>
            </FormGroup>
            <FormGroup className="mb-3">
              <span style={fieldLabel}>Expected Delivery Date</span>
              <div style={fieldVal}>{sbPoDeliveryDate ? new Date(sbPoDeliveryDate).toLocaleDateString("en-AU") : "—"}</div>
            </FormGroup>
          </Col>

        </div>
      </div>

      {/* Add Product Item */}
      <div style={{ display: visible ? "block" : "none" }}>
        <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:"12px", marginBottom:"12px" }}>
          <div style={{ padding:"10px 16px", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.5px", background:"#f9fafb", borderBottom:"0.5px solid #e5e7eb", borderRadius:"12px 12px 0 0" }}>
            Add Product Item <span style={{ color:"#ef4444" }}>*</span>
          </div>

          {/* ✅ clearfix — float children card-ல contain ஆகும் */}
          <div className="g-2 mb-3 clearfix">

            <Col md={4} className="ps-3 py-3 float-start">
              <FormGroup>
                <span style={fieldLabel}>Product</span>
                <SearchableSelect
                  options={lineItems}
                  value={newLineItemProductId || ""}
                  onChange={e => setNewLineItemProductId(e.target.value)}
                  labelKey="title" valueKey="product_id" displayKey="title"
                  placeholder="Select Product"
                />
              </FormGroup>
            </Col>

            <div className="py-3 float-start" style={{ width:"160px" }}>
              <FormGroup>
                <span style={fieldLabel}>QTY Ordered</span>
                <input type="number" className="form-control"
                  style={{ fontSize:"13px", background:"#f3f4f6", border:"0.5px solid #e5e7eb", color:"#9ca3af", borderRadius:"8px" }}
                  value={selectedProduct?.quantity || ""} readOnly disabled />
              </FormGroup>
            </div>

            <div className="ps-2 py-3 float-start" style={{ width:"160px" }}>
              <FormGroup>
                <span style={fieldLabel}>QTY Received</span>
                <input type="number" className="form-control"
                  style={{ fontSize:"13px", border:"0.5px solid #d1d5db", borderRadius:"8px" }}
                  min="1" max={selectedProduct?.quantity || ""}
                  value={receivedQty}
                  onChange={e => setReceivedQty(e.target.value)}
                  onFocus={e => e.target.select()}
                />
              </FormGroup>
            </div>

            <Col md={4} className="ps-2 py-3 mt-1 ms-2 float-start">
              <FormGroup>
                <Row>
                  <span style={fieldLabel}>&nbsp;</span>
                  <Button
                    style={{
                      maxWidth:"100px", fontSize:"13px", borderRadius:"8px", fontWeight:500,
                      background: (!newLineItemProductId || !newLineItemInvoiceId) ? "#e5e7eb" : "#185FA5",
                      border:"none",
                      color: (!newLineItemProductId || !newLineItemInvoiceId) ? "#9ca3af" : "#fff",
                    }}
                    className="me-2 ms-0"
                    disabled={!newLineItemProductId || !newLineItemInvoiceId}
                    onClick={() => {
                      if (!receivedQty || Number(receivedQty) < 1) { toast.error("Minimum qty 1!"); return; }
                      if (selectedProduct && Number(receivedQty) > Number(selectedProduct.quantity)) { toast.error(`Max qty is ${selectedProduct.quantity}`); return; }
                      if (receivedLineItems.some(r => r.product_id === Number(newLineItemProductId))) { toast.error("Product already added!"); return; }

                      setReceivedLineItem(prev => [...prev, {
                        product_id:     Number(newLineItemProductId),
                        po_invoice_id:  newLineItemInvoiceId,
                        invoice_number: poInvoices.find(p => p.po_invoice_id === Number(newLineItemInvoiceId))?.invoice_number || "",
                        received_date:  poReceiveDetails?.received_date || null,
                        delivery_date:  poReceiveDetails?.received_date || null,
                        received_qty:   Number(receivedQty),
                      }]);

                      const idx = lineItems.findIndex(li => li.product_id === Number(newLineItemProductId));
                      if (idx !== -1) updateLineItem(idx, "receive_item_details.received_qty", Number(receivedQty));

                      setNewLineItemProductId("");
                      setReceivedQty("");
                    }}
                  >Add</Button>

                  <Button
                    style={{ maxWidth:"100px", fontSize:"13px", borderRadius:"8px", border:"0.5px solid #d1d5db", background:"none", color:"#6b7280" }}
                    onClick={() => { setNewLineItemInvoiceId(""); setNewLineItemProductId(""); setReceivedLineItem([]); setReceivedQty(""); }}
                  >Clear</Button>
                </Row>
              </FormGroup>
            </Col>

          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiveOrderInfoSection;