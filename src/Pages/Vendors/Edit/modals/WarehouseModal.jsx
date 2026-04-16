import React from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

const WarehouseModal = ({ show, onHide, tempWarehouse, setTempWarehouse, countries, warehouseStates, onSave, onCountryChange }) => (
    <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton><Modal.Title className="h6 fw-bold">Vendor Details</Modal.Title></Modal.Header>
        <Modal.Body className="px-4">
            <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Address Line 1</Form.Label>
                <Form.Control size="sm" value={tempWarehouse.address_line1} onChange={e => setTempWarehouse({...tempWarehouse, address_line1: e.target.value})} />
            </Form.Group>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className="small fw-bold">City</Form.Label>
                    <Form.Control size="sm" value={tempWarehouse.city} onChange={e => setTempWarehouse({...tempWarehouse, city: e.target.value})} />
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">State</Form.Label>
                    <Form.Select size="sm" value={tempWarehouse.state_id} onChange={e => setTempWarehouse({...tempWarehouse, state_id: e.target.value})} disabled={!tempWarehouse.country_id}>
                        <option value="">Select State</option>
                        {warehouseStates.map(s => <option key={s.id} value={s.id}>{s.text}</option>)}
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className="small fw-bold">Country</Form.Label>
                    <Form.Select size="sm" value={tempWarehouse.country_id} onChange={e => onCountryChange(e.target.value)}>
                        <option value="">Select</option>
                        {countries?.map(c => <option key={c.id} value={c.id}>{c.text}</option>)}
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">ZIP Code</Form.Label>
                    <Form.Control size="sm" value={tempWarehouse.zip} onChange={e => setTempWarehouse({...tempWarehouse, zip: e.target.value})} />
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onSave}>Save Details</Button>
        </Modal.Footer>
    </Modal>
);

export default WarehouseModal;