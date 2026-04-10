import React from "react";
import { Col, FormGroup, FormLabel } from 'react-bootstrap';
import SearchableSelect from "../../../Components/Common/SearchableSelect";
import DateInput from "../../../Components/Common/DateInput";

const OrderInfoSection = ({
  sbPoNumber, setSbPoNumber, vendors, selectedVendorId, handleVendorChange,
  vendorDetails, sbPoDate, setSbPoDate, warehouses, selectedWarehouse,
  handleWarehouseChange, deliveryForm, setDeliveryForm, states, countries,
  setSbPoDeliveryDate, sbPoDeliveryDate,
  glboalTaxRate, setGlobalTaxRate,
  globalDiscount, setGlobalDiscount,
  minOrderValue, setMinOrderValue,
  vendorOrders, setVendorOrders,
  isPlaced = false,  // ✅ default false
}) => {
  const primaryVendorPO =
    vendorOrders?.find(v => v.is_primary) ||
    vendorOrders?.[0] ||
    { vendor_po_number:"", order_number:"", order_date:null };

  // ✅ locked style for disabled fields
  const lockedStyle = isPlaced
    ? { background:"#f9fafb", color:"#6b7280", cursor:"not-allowed" }
    : {};

  return (
    <div className="card mb-4">
      <div className="card-header fw-bold">Order Information</div>

      {/* Honeypot */}
      <div style={{ display:"none" }}>
        <input type="text" autoComplete="username" />
        <input type="password" autoComplete="current-password" />
      </div>

      <div className="row pb-2 p-2">

        {/* ── Col 1: PO + Vendor ── */}
        <Col md={4} className="px-4 py-3">
          <FormGroup className="mb-2">
            <FormLabel className="form-label ps-1">
              SB PO Number<span className="text-danger">*</span>
            </FormLabel>
            <input
              className="form-control"
              autoComplete="new-password"
              value={sbPoNumber}
              disabled={isPlaced}   // ✅ locked
              style={lockedStyle}
              onChange={e => setSbPoNumber(e.target.value)}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label ps-1">
              Vendor Code <span className="text-danger">*</span>
            </label>
    
            <SearchableSelect
              options={vendors}
              value={selectedVendorId}
              displayKey="vendor_code"
              onChange={handleVendorChange}
              labelKey="vendor_name"
              valueKey="id"
              placeholder="Select vendor"
              searchKey={["vendor_code", "vendor_name"]}
              disabled={isPlaced}   // ✅ locked
              renderLabel={(v) => (
                <div className="d-flex flex-column searchable-select-item-content">
                  <b className="item-title">{v.vendor_code}</b>
                  <small className="item-subtitle">{v.vendor_name}</small>
                </div>
              )}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label ps-1">Vendor Name</label>
            <input className="form-control input-readonly-dotted" value={vendorDetails.name} readOnly />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label">Minimum Purchase</label>
            <input type="text" className="form-control input-readonly-dotted"
              value={minOrderValue || ""} readOnly onChange={e => setMinOrderValue(e.target.value)} />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label">Discount (%)</label>
            <input type="number" className="form-control bg-light" value={globalDiscount}
              min="0" max="100"
              disabled={isPlaced}
              style={lockedStyle}
              onChange={(e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val)) { setGlobalDiscount(""); return; }
                if (val < 0) val = 0;
                if (val > 100) val = 100;
                setGlobalDiscount(val);
              }}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label">Tax Rate (%)</label>
            <input type="number" className="form-control bg-light" value={glboalTaxRate}
              disabled={isPlaced}
              style={lockedStyle}
              onChange={(e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val)) { setGlobalTaxRate(""); return; }
                if (val < 0) val = 0;
                if (val > 100) val = 100;
                setGlobalTaxRate(val);
              }}
            />
          </FormGroup>
        </Col>

        {/* ── Col 2: Warehouse + Delivery ── */}
        <Col md={4} className="px-4 py-3">
          <FormGroup className="mb-2">
            <label className="form-label">SB Warehouse <span className="text-danger">*</span></label>
            <select
              className="form-control form-select"
              value={selectedWarehouse?.id || ""}
              disabled={isPlaced}   // ✅ locked
              style={lockedStyle}
              onChange={handleWarehouseChange}
            >
              <option value="">Select</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label">Delivery Name</label>
            <input className="form-control" autoComplete="new-password" name="po_del_name"
              value={deliveryForm.delivery_name}
              disabled={isPlaced}
              style={lockedStyle}
              onChange={e => setDeliveryForm({ ...deliveryForm, delivery_name: e.target.value })}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label">Address Line 1</label>
            <input className="form-control" autoComplete="new-password" name="po_addr1"
              value={deliveryForm.address_line1}
              disabled={isPlaced}
              style={lockedStyle}
              onChange={e => setDeliveryForm({ ...deliveryForm, address_line1: e.target.value })}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <label className="form-label">Address Line 2</label>
            <input className="form-control" autoComplete="new-password" name="po_addr2"
              value={deliveryForm.address_line2}
              disabled={isPlaced}
              style={lockedStyle}
              onChange={e => setDeliveryForm({ ...deliveryForm, address_line2: e.target.value })}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <select className="form-control form-select" name="po_cnt" autoComplete="new-password"
                  value={deliveryForm.country}
                  disabled={isPlaced}
                  style={lockedStyle}
                  onChange={e => setDeliveryForm({ ...deliveryForm, country: e.target.value })}
                >
                  <option value="">Select</option>
                  {countries?.map(c => <option key={c.id} value={c.id}>{c.text}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">State</label>
                <select className="form-control form-select" name="po_loc" autoComplete="new-password"
                  value={deliveryForm.state || ""}
                  disabled={isPlaced}
                  style={lockedStyle}
                  onChange={e => setDeliveryForm({ ...deliveryForm, state: Number(e.target.value) })}
                >
                  <option value="">Select</option>
                  {states?.map(s => <option key={s.id} value={Number(s.id)}>{s.text}</option>)}
                </select>
              </div>
            </div>
          </FormGroup>

          <div className="row mt-2">
            <div className="col-md-6">
              <label className="form-label">City</label>
              <input className="form-control" autoComplete="new-password" name="po_loc1"
                value={deliveryForm.city}
                disabled={isPlaced}
                style={lockedStyle}
                onChange={e => setDeliveryForm({ ...deliveryForm, city: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">ZIP</label>
              <input className="form-control" autoComplete="new-password" name="po_loc2"
                value={deliveryForm.zip}
                disabled={isPlaced}
                style={lockedStyle}
                onChange={e => setDeliveryForm({ ...deliveryForm, zip: e.target.value })}
              />
            </div>
          </div>
        </Col>

        {/* ── Col 3: Dates + Vendor PO ── */}
        <Col md={4} className="px-4 py-3">
            <FormGroup className="mb-2">
              <label className="form-label">SBPO Order Date <span className="text-danger">*</span></label>
              <DateInput value={sbPoDate} disabled={isPlaced} style={lockedStyle} onChange={date => setSbPoDate(date)} />
            </FormGroup>

            <FormGroup className="mb-2">
              <FormLabel>Expected Delivery Date</FormLabel>
              <DateInput value={sbPoDeliveryDate} disabled={isPlaced} style={lockedStyle} onChange={date => setSbPoDeliveryDate(date)} />
            </FormGroup>

            <FormGroup className="mb-2">
              <label className="form-label">Currency Code</label>
              <input className="form-control input-readonly-dotted" type="text" value={vendorDetails.currency} readOnly />
            </FormGroup>

            <FormGroup className="mb-2">
              <label className="form-label">Vendor PO</label>
              <input className="form-control" autoComplete="new-password" name="po_vpo"
                value={primaryVendorPO.vendor_po_number || ""}
                disabled={isPlaced}
                style={lockedStyle}
                onChange={e =>
                  setVendorOrders(prev => {
                    if (!prev || prev.length === 0) return [{ vendor_po_number:e.target.value, order_number:"", order_date:null, is_primary:true }];
                    const updated = [...prev];
                    updated[0] = { ...updated[0], vendor_po_number:e.target.value, is_primary:true };
                    return updated;
                  })
                }
              />
            </FormGroup>

            <FormGroup className="mb-2">
              <label className="form-label">Vendor PO Order Date</label>
              <DateInput
                value={primaryVendorPO.order_date || null}
                disabled={isPlaced}
                style={lockedStyle}
                onChange={date =>
                  setVendorOrders(prev => {
                    const updated = [...prev];
                    updated[0] = { ...updated[0], order_date:date, is_primary:true };
                    return updated;
                  })
                }
              />
            </FormGroup>

            <FormGroup className="mb-2">
              <label className="form-label">Vendor PO Order No</label>
              <input className="form-control" autoComplete="new-password" name="po_vpo_no"
                value={primaryVendorPO.order_number || ""}
                disabled={isPlaced}
                style={lockedStyle}
                onChange={e =>
                  setVendorOrders(prev => {
                    const updated = [...prev];
                    updated[0] = { ...updated[0], order_number:e.target.value, is_primary:true };
                    return updated;
                  })
                }
              />
            </FormGroup>
          </Col>

      </div>
    </div>
  );
};

export default OrderInfoSection;