import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Button, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from "react-hot-toast";

import ProductAutoComplete from "../../../Components/ProductAutoComplete";
import InlineEditableNumber from "../../../Components/InlineEditableNumber";
import { useMasterData } from "../../../Context/MasterDataProvider";
import { API_BASE } from "../../../Config/api";
import apiFetch from "../../../Utils/apiFetch";
import formatCurrency from "../../../Utils/utilFunctions";
import SearchableSelect from "../../../Components/SearchableSelect";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faTableColumns, faListUl } from '@fortawesome/free-solid-svg-icons';

import DateInput from "../../../Components/DateInput";

const  VendorOrdersSection = ({ vendorOrders, updateVendorOrder, deleteVendorOrder, addVendorOrder }) => (
  <div className="card mb-4">
    <div className="card-header fw-bold">Vendor PO Details</div>
    <div className="card-body">
      
      {vendorOrders.map((row, index) => (
        <div className="row g-2 align-items-end mb-2" key={index}>
          <div className="col-md-4"><label className="form-label">Vendor PO Number</label><input className="form-control" value={row.vendor_po_number} onChange={e => updateVendorOrder(index, "vendor_po_number", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Vendor Order #</label><input className="form-control" value={row.order_number} onChange={e => updateVendorOrder(index, "order_number", e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label ">PO Order Date</label>
          <DateInput
            value={row.order_date ? new Date(row.order_date) : null} dateFormat="dd/MM/yyyy"
            onChange={(date) => updateVendorOrder(index, "order_date", date?.toISOString().split("T")[0])}
          />
         </div>
          <div className="col-md-1 text-end">{vendorOrders.length > 1 && <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteVendorOrder(index)}>Delete</button>}</div>
        </div>
      ))}
      <button type="button" className="btn mt-2 btn-sm bg-gradient-primary" onClick={addVendorOrder}>Add More</button>
    </div>
  </div>
);

export default VendorOrdersSection;
