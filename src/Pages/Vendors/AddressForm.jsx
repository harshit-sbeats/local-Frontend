import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab, Form, Row, Col, Button, Modal, Table, Spinner } from 'react-bootstrap';



export const AddressForm = React.memo(({ type, data, countries, states, onChange }) => (
    <Col md={6} className={type === 'billing' ? "border-end px-4" : "px-2"}>
        <h6 className="fw-bold mb-3">{type === 'billing' ? "Billing Address" : "Shipping Address"}</h6>
        <Form.Group className="mb-2">
            <Form.Label className="small">Attention</Form.Label>
            <Form.Control size="md" value={data.attention || ""} onChange={e => onChange(type, 'attention', e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2">
            <Form.Label className="small">Country / Region</Form.Label>
            <Form.Select size="md" value={data.country || ""} onChange={e => onChange(type, 'country', e.target.value)}>
                <option value="">Select Country</option>
                {countries?.map(c => <option key={c.id} value={c.id}>{c.text}</option>)}
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
            <Form.Label className="small">Building / Street</Form.Label>
            <Form.Control as="textarea" rows={2} size="md" className="mb-1" value={data.street1 || ""} onChange={e => onChange(type, 'street1', e.target.value)} placeholder="Street 1" />
            <Form.Control as="textarea" rows={2} size="md" value={data.street2 || ""} onChange={e => onChange(type, 'street2', e.target.value)} placeholder="Street 2" />
        </Form.Group>
        <Row className="mb-2">
            <Col md={6}>
                <Form.Label className="small">State</Form.Label>
                <Form.Select size="md" value={data.state || ""} onChange={e => onChange(type, 'state', e.target.value)}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.text}</option>)}
                </Form.Select>
            </Col>
            <Col md={6}>
                <Form.Label className="small">City</Form.Label>
                <Form.Control size="md" value={data.city || ""} onChange={e => onChange(type, 'city', e.target.value)} />
            </Col>
        </Row>
        <Row>
            <Col md={6}><Form.Label className="small">ZIP Code</Form.Label><Form.Control size="md" value={data.zip || ""} onChange={e => onChange(type, 'zip', e.target.value)} /></Col>
            <Col md={6}><Form.Label className="small">Phone</Form.Label><Form.Control size="md" value={data.phone || ""} onChange={e => onChange(type, 'phone', e.target.value)} /></Col>
        </Row>
    </Col>
));