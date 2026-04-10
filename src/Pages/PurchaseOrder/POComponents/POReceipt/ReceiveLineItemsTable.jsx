import React, { useState } from "react";
import { toast } from "react-hot-toast";
import formatCurrency, { formatAUD, formattedDate } from "../../../../Utils/utilFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import InlineEditableNumber from "../../../../Components/Common/InlineEditableNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ReceiveLineItemsTable = ({ receivedLineItems, receiveDetails, lineItems, updateLineItem, deleteLineItem, setReceivedLineItem }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingComment, setEditingComment] = useState("");

  const thStyle = {
    padding:"9px 12px", fontSize:"11px", fontWeight:500, color:"#ffffff",
    textTransform:"uppercase", letterSpacing:"0.4px", borderBottom:"0.5px solid #d1d5db",
    whiteSpace:"nowrap", background:"#111213"
  };
  const tdStyle = { padding:"10px 12px", fontSize:"13px", color:"#111827", borderBottom:"0.5px solid #f3f4f6", verticalAlign:"middle" };

  const filtered = lineItems.filter(item => receivedLineItems.some(r => r.product_id === item.product_id));

  return (
    <div style={{ overflowX:"auto", borderRadius:"8px", border:"0.5px solid #e5e7eb" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
        <thead >
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Invoice</th>
            <th style={{ ...thStyle, minWidth:"200px" }}>Product</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Disc %</th>
            <th style={thStyle}>Subtotal</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>GST</th>
            <th style={thStyle}>Received Date</th>
            <th style={thStyle}>Comment</th>
            <th style={thStyle}>Ordered</th>
            <th style={{ ...thStyle, textAlign:"right" }}>Received</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {receivedLineItems.length === 0 ? (
            <tr><td colSpan="13" style={{ ...tdStyle, textAlign:"center", color:"#9ca3af", padding:"24px" }}>No items added yet</td></tr>
          ) : (
            filtered.map((item, i) => {
              const r = receivedLineItems.find(r => r.product_id === item.product_id);
              const isMatch = Number(r?.received_qty || 0) === Number(item.quantity || 0);
              return (
                <tr key={item.product_id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{r?.invoice_number || "—"}</td>
                  <td style={tdStyle}>
                    <Tippy content={item.comment || "No comment"} theme="custom-gray" delay={[200,200]} placement="top">
                      <div>
                        <div style={{ fontWeight:500, fontSize:"12px" }}>{item.title}</div>
                        <div style={{ fontSize:"11px", color:"#9ca3af", marginTop:"2px" }}>SKU: {item.sku} | ASIN: {item.asin}</div>
                      </div>
                    </Tippy>
                  </td>
                  <td style={tdStyle}>{formatAUD(item.price)}</td>
                  <td style={tdStyle}>{item.discount}%</td>
                  <td style={tdStyle}>{formatCurrency(item.sub_total)}</td>
                  <td style={tdStyle}>{formatCurrency(item.total)}</td>
                  <td style={tdStyle}>{item.gst_percent}%</td>
                  <td style={{ ...tdStyle, width:"90px" }}>
                    {receiveDetails?.status_id === 4 ? (
                      <span>{formattedDate(r?.received_date) || "—"}</span>
                    ) : (
                      <DatePicker
                        selected={r?.received_date ? new Date(r.received_date) : null}
                        onChange={date => setReceivedLineItem(prev => prev.map(ri => ri.product_id === item.product_id ? { ...ri, received_date: date } : ri))}
                        dateFormat="dd-MM-yyyy"
                        customInput={<input style={{ width:"63px", border:"none", borderBottom:"1px dashed #9ca3af", background:"transparent", fontSize:"12px", cursor:"pointer" }} readOnly />}
                      />
                    )}
                  </td>
                  <td style={{ ...tdStyle, maxWidth:"120px", cursor:"pointer" }}
                    onClick={() => { setExpandedRow(item.product_id); setEditingComment(item.comment || ""); }}>
                    <span style={{ fontSize:"11px", color:"#9ca3af" }}>{item.comment || "—"}</span>
                  </td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={{ ...tdStyle, textAlign:"right", width:"100px" }}>
                    <span style={{ fontWeight:600, color: isMatch ? "#15803d" : "#b45309" }}>
                      {receiveDetails?.status_id !== 4 ? (
                      <InlineEditableNumber precision={0} format="number" value={item.receive_item_details?.received_qty}
                            onChange={v => updateLineItem(i, "receive_item_details.received_qty", v)}
                        />):item.receive_item_details?.received_qty}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button className="btn"
                      style={{ fontSize:"11px", padding:"4px 8px",
                         borderRadius:"6px", border:"0.5px solid #fca5a5", background:"#fff",
                          color:"#dc2626", cursor:"pointer" }}
                      onClick={() => {
                        setReceivedLineItem(prev => prev.filter(ri => ri.product_id !== item.product_id));
                        deleteLineItem(item.product_id);
                      }}
                    ><FontAwesomeIcon icon={faTrash}/></button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiveLineItemsTable;