import React from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

const ContactModal = ({ show, onHide, tempContact, setTempContact, onSave }) => (
    <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
            <Modal.Title className="h6 fw-bold">Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Label className="small fw-bold">First Name</Form.Label>
                    <Form.Control size="sm" value={tempContact.first_name} onChange={e => setTempContact({...tempContact, first_name: e.target.value})} />
                </Col>
                <Col md={4}>
                    <Form.Label className="small fw-bold">Last Name</Form.Label>
                    <Form.Control size="sm" value={tempContact.last_name} onChange={e => setTempContact({...tempContact, last_name: e.target.value})} />
                </Col>
                <Col md={4}>
                    <Form.Label className="small fw-bold">Department</Form.Label>
                    <Form.Select size="sm" value={tempContact.department} onChange={e => setTempContact({...tempContact, department: e.target.value})}>
                        <option value="">Select</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className="small fw-bold">Email</Form.Label>
                    <Form.Control size="sm" value={tempContact.email} onChange={e => setTempContact({...tempContact, email: e.target.value})} />
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">Phone</Form.Label>
                    <Form.Control size="sm" value={tempContact.phone} onChange={e => setTempContact({...tempContact, phone: e.target.value})} />
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onSave}>Save Contact</Button>
        </Modal.Footer>
    </Modal>
);

export default ContactModal;