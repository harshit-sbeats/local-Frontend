import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Button, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from "react-hot-toast";

import ProductAutoComplete from "../../../Components/ProductAutoComplete";
import InlineEditableNumber from "../../../Components/Common/InlineEditableNumber";
import { useMasterData } from "../../../Context/MasterDataProvider";
import { API_BASE } from "../../../Config/api";
import apiFetch from "../../../Utils/apiFetch";

import formatCurrency, { formatAUD, formattedDate } from "../../../Utils/utilFunctions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faTableColumns, faListUl } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Popover  } from "react-bootstrap";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const LineItemsTable = ({ lineItems, updateLineItem, deleteLineItem, isPlaced = false }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingComment, setEditingComment] = useState("");

    const lockedStyle = isPlaced
        ? { background: "#f9fafb", color: "#6b7280", cursor: "not-allowed", pointerEvents: "none" }
        : {};

    return (
  <div className="table-responsive mt-3 ">
    <table className="rounded-top mb-0 overflow-hidden table table-striped align-middle">
      <thead className="table-dark">
        <tr>
          <th className="align-middle" style={{width:"40%"}}>Item Details</th>
          <th className="align-middle" style={{width:"10%"}}>Delivery Date</th>
          <th className="align-middle" style={{width:"10%"}}>Qty Ordered</th>
          <th className="align-middle"  style={{width:"10%"}}>Unit Price (Ex GST)</th>
          <th className="align-middle" style={{width:"10%"}}>Dist (%)</th>
          <th className="align-middle" style={{width:"10%"}}>Sub Total (Ex GST)</th>
          <th className="align-middle" style={{width:"10%"}}>GST Rate (%)</th>
          <th className="align-middle" style={{width:"10%"}}>GST Amount</th>
          <th className="align-middle" style={{width:"10%"}}>
            <Tippy
              content={"Landed Cost Per Item Excl. GST"}
              interactive={true}
              theme="custom-gray"
              delay={[200, 200]}
              placement="top"
            ><span>Landed Cost</span></Tippy>
          </th>
          <th className="align-middle">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {lineItems.length === 0 ? <tr><td colSpan="11" className="text-center">No records found</td></tr> : 
          lineItems.map((item, i) => (
            <React.Fragment key={item.product_id}>
            <tr>
            <td style={{ minWidth: "220px" }} onClick={() => {
                if (isPlaced) return;  // ← locked
                setExpandedRow(item.product_id);
                setEditingComment(item.comment || "");
            }}>
                <Tippy
                    content={
                    <div style={{ maxWidth: "300px" }}>
                        <div style={{ maxHeight: "150px", overflowY: "auto" }} 
                        onClick={() => {
                            if (isPlaced) return;  // ← locked
                            setExpandedRow(item.product_id);
                            setEditingComment(item.comment || "");
                        }}
                        >
                        {item.comment || "No comment"}
                        </div>
                    </div>
                    }
                    interactive={true}
                    theme="custom-gray"
                    delay={[200, 200]}
                    placement="top"
                >
                <div className="d-flex align-items-start gap-3" style={{ cursor: isPlaced ? "not-allowed" : "pointer" }}>
                    <img
                    src={
                        item.po_image_url?.startsWith("http")
                        ? item.po_image_url
                        : `${API_BASE}api/${item.po_image_url}`
                    }
                    alt=""
                    className="border rounded"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                    <span className="fw-bold d-block" >{item.title}</span>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                        SKU: {item.sku} | ASIN: {item.asin}
                    </div>
                    </div>
                </div>
                </Tippy>
            </td>

            <td className="align-middle">
                {isPlaced?<>{formattedDate(item.delivery_date)}</>:<>
                <DatePicker
                    selected={item.delivery_date ? new Date(item.delivery_date) : null}
                    onChange={(date) => !isPlaced && updateLineItem(i, "delivery_date", date)}
                    dateFormat="dd-MM-yyyy"
                    customInput={
                        <input
                            style={{ width: "70px" }}
                            className="date-display"
                            readOnly
                        />
                    }
                /></>}
            </td>

            <td className="align-middle">
                {isPlaced?<>{item.quantity}</>:<><InlineEditableNumber
                    format="number"
                    value={item.quantity}
                    precision={0}
                    disabled={isPlaced}
                    onChange={v => !isPlaced && updateLineItem(i, "quantity", v)}
                /></>}
                
            </td>

            <td className="align-middle">
                {isPlaced?<>{formatAUD(item.price)}</>:<><InlineEditableNumber
                    value={item.price}
                    disabled={isPlaced}
                    onChange={v => !isPlaced && updateLineItem(i, "price", v)}
                /></>}
                
            </td>

            <td className="align-middle">
                {isPlaced?<>{item.discount}%</>:<>
                <InlineEditableNumber
                    format="percent"
                    value={item.discount}
                    disabled={isPlaced}
                    onChange={v => !isPlaced && updateLineItem(i, "discount", v)}
                /></>}
            </td>

            <td className="align-middle">{formatCurrency(item.sub_total)}</td>

            <td className="align-middle">
                {isPlaced?<>{item.gst_percent}%</>:<>
                <InlineEditableNumber
                    format="percent"
                    value={item.gst_percent}
                    disabled={isPlaced}
                    onChange={v => !isPlaced && updateLineItem(i, "gst_percent", v)}
                /></>}
            </td>

            <td className="align-middle">{formatCurrency(item.gst_amount)}</td>
            <td className="align-middle">{formatCurrency(item.cost_per_item)}</td>
            <td className="align-middle">{formatCurrency(item.total)}</td>

            <td className="align-middle">
                <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={isPlaced}
                    style={isPlaced ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                    onClick={() => !isPlaced && deleteLineItem(i)}
                >
                    <i className="fa fa-trash"></i>
                </button>
            </td>
            </tr>

            {/* Expanded Inline Row - comment edit, locked when placed */}
            {expandedRow === item.product_id && !isPlaced && (
                <tr>
                    <td colSpan="11" className="p-1">
                        <textarea
                        className="form-control form-control-soft form-control-sm"
                        rows={2}
                        value={editingComment || ""}
                        autoFocus
                        onChange={(e) => setEditingComment(e.target.value)}
                        onBlur={() => {
                            updateLineItem(i, "comment", editingComment);
                            setExpandedRow(null);
                        }}
                        />
                    </td>
                </tr>
            )}
            </React.Fragment>
          ))}
      </tbody>
    </table>
  </div>
);
}

export default LineItemsTable;