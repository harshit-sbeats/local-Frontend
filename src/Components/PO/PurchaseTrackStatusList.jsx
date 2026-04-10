import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";

import axios from "axios";
import { Modal, Table, Button, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { apiFetch } from "../../Utils/apiFetch";
import useMasterData from "../../Context/MasterDataProvider";
import { API_BASE } from "../../Config/api";

const PurchaseTrackStatusList = () => {
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);
  const { vendors} = useMasterData();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const formattedDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    tabulatorRef.current = new Tabulator(tableRef.current, {
      height: "500px",
      layout: "fitColumns",
      placeholder: "No Records found",
      ajaxURL: `${API_BASE}api/purchaseorder/api/intransit/listing_json`,
      pagination: true,
      paginationMode: "remote",
      paginationSize: 20,

      ajaxParams: function () {
        return {
          po_order: document.getElementById("filter_po_order")?.value || "",
          vendor_id: document.getElementById("filter_vendor_id")?.value || "",
          tracking_no: document.getElementById("filter_tracking_no")?.value || "",
          date_from: document.getElementById("filter_expected_rcvd_from_date")?.value || "",
          date_to: document.getElementById("filter_expected_rcvd_to_date")?.value || "",
        };
      },

      ajaxRequestFunc: function (url, config, params) {
        const query = new URLSearchParams({
          ...params,
          page: params.page || 1,
          size: params.size || 20,
        }).toString();

        return fetch(`${url}?${query}`, {
          method: "GET",
          credentials: "include",
        }).then((res) => res.json());
      },

      ajaxResponse: function (url, params, response) {
        return {
          data: response.data || [],
          last_page: response.last_page || 1,
        };
      },

      columns: [
        { title: "ORDER DATE", field: "order_date", width: 120, formatter: (cell) => formattedDate(cell.getValue()) },
        { 
          title: "PO NUMBER", 
          field: "po_number", 
          formatter: (cell) => {
            const rowData = cell.getRow().getData();
            return `<a class="text-primary font-weight-bold" href="/purchaseorder/poreceives/edit/${rowData.po_receive_id}">${cell.getValue()}</a>`;
          } 
        },
        { 
          title: "ITEM", 
          field: "product_name", 
          formatter: (cell) => {
            const d = cell.getRow().getData();
            return `<b>${d.product_name}</b><br/><small>${d.product_sku}</small>`;
          } 
        },
        { title: "VENDOR", field: "vendor_name" },
        {
          title: "TRACKING",
          headerSort: false,
          hozAlign: "center",
          formatter: () => `<a class="text-primary cursor-pointer" style="text-decoration:underline">Track</a>`,
          cellClick: (e, cell) => {
            const d = cell.getRow().getData();
            openShippingModal(d.po_id, d.product_id, d.received_item_id);
          },
        },
        { title: "ORDERED QTY", field: "ordered_qty", hozAlign: "center" },
        { title: "RECEIVED QTY", field: "received_qty", hozAlign: "center" },
        {
          title: "STATUS",
          field: "received_status",
          formatter: (cell) => {
            const status = cell.getValue();
            return `<span class="badge bg-info text-white px-2 py-1">${status === 2 ? "Shipped" : "Pending"}</span>`;
          },
        },
      ],
    });

    return () => tabulatorRef.current?.destroy();
  }, []);

  const openShippingModal = async (poId, productId, receivedItemId) => {
    setLoadingModal(true);
    setModalData([]);
    setShowModal(true);

    try {
        const response = await apiFetch(
          `${API_BASE}api/purchaseorder/api/purchase-order/${poId}/${productId}/${receivedItemId}/shipments/`,
          { method: "GET" }
        );
        // Accessing response.data directly as per your confirmed apiFetch behavior
        setModalData(response.data || []);
    } catch (err) {
        console.error("Failed to fetch shipments", err);
    } finally {
        setLoadingModal(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    tabulatorRef.current.setData();
  };

  const handleClear = () => {
    document.getElementById("intransitFilterForm").reset();
    tabulatorRef.current.setData();
  };

  return (
    <div className="p-0">
      <h3 className="mb-3 fw-bold">In-Transit Listings</h3>
      
      <Card className="border-0 card mb-3">
        <Card.Body className="p-4">
          <Form id="intransitFilterForm" onSubmit={handleSearch}>
            <Row className="g-3">
              {/* Purchase Order# */}
              <Col lg={3} md={6}>
                <Form.Label className="fw-normal text-muted mb-2">Purchase Order#</Form.Label>
                <Form.Control 
                  type="text" 
                  id="filter_po_order" 
                  placeholder="PO-12345" 
                  className="form-control py-2"
                />
              </Col>

              {/* Vendor */}
              <Col lg={3} md={6}>
                <Form.Label className="fw-normal text-muted mb-2">Vendor</Form.Label>
                <Form.Select 
                  id="filter_vendor_id" 
                  className="form-control  py-2"
                >
                  <option value="">select</option>
                  {vendors?.map(v => <option key={v.id} value={v.id}>{v.display_name}</option>)}
                </Form.Select>
              </Col>

              {/* Tracking# */}
              <Col lg={3} md={6}>
                <Form.Label className="fw-normal text-muted mb-2">Tracking#</Form.Label>
                <Form.Control 
                  type="text" 
                  id="filter_tracking_no" 
                  placeholder="TRK-000" 
                  className="form-control  py-2"
                />
              </Col>

              {/* Expected Received Date Range */}
              <Col lg={3} md={6}>
                <Form.Label className="fw-normal text-muted mb-2">Expected Received Date</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="date" 
                    id="filter_expected_rcvd_from_date" 
                    className="form-control  py-2"
                  />
                  <InputGroup.Text className="form-control  text-muted px-2">to</InputGroup.Text>
                  <Form.Control 
                    type="date" 
                    id="filter_expected_rcvd_to_date" 
                    className="form-control  py-2"
                  />
                </InputGroup>
              </Col>
            </Row>

            <div className="mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={handleClear} 
                className="px-4 py-2 me-2 border-1 bg-white"
              >
                Clear
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                className="px-4 py-2 shadow-sm"
              >
                Search
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="">
        <Card.Body className="p-2">
          <div ref={tableRef}></div>
        </Card.Body>
      </Card>

      {/* REACT-BOOTSTRAP MODAL COMPONENT */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="xl" 
        centered
      >
        <Modal.Header closeButton className="py-3 border-0 bg-white">
          <Modal.Title className="h5 fw-bold">Shipping & Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Table responsive bordered hover size="sm" className="mb-0 border-start-0 border-end-0" style={{ fontSize: '0.9rem' }}>
            <thead className="bg-light text-muted">
              <tr>
                <th className="px-4 py-3 fw-bold border-0">Provider</th>
                <th className="px-4 py-3 fw-bold border-0">Tracking</th>
                <th className="px-4 py-3 fw-bold border-0">Shipped Date</th>
                <th className="px-3 py-3 fw-bold border-0 text-center">Received Date</th>
              </tr>
            </thead>
            <tbody>
              {loadingModal ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </td>
                </tr>
              ) : modalData?.length > 0 ? (
                modalData.map((item) => (
                  <tr key={item.po_shipping_id} className="align-middle">
                    <td className="px-4 py-3 text-secondary">{item.provider_name}</td>
                    <td className="px-4 py-3 fw-bold">
                      <a 
                        href={item.provider_tracking_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-primary text-decoration-none"
                      >
                        {item.tracking_number}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-secondary">{formattedDate(item.shipped_date)}</td>
                    <td className="px-3 py-3 text-secondary text-center">{formattedDate(item.received_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">No shipping records found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PurchaseTrackStatusList;