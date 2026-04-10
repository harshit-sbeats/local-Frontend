import React from "react";
import { Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
//import SearchableSelect from "../../SearchableSelect";
import SearchableSelect from "../../../../Components/Common/SearchableSelect";

//import ABNInput from "../../ABNInput";
//import ACNInput from "../../ACNInput";
import ABNInput from "../../../../Components/Common/ABNInput";
import ACNInput from "../../../../Components/Common/ACNInput";
import { useMasterData } from "../../../../Context/MasterDataProvider";

const PrimaryDetailsTab = ({ primary, setPrimary }) => {
    const { countries, paymentTerms } = useMasterData();

    const handleChange = (field, value) => {
        setPrimary(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="py-3 px-2">
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className="small fw-bold">Vendor Code <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        placeholder="VEND001"
                        value={primary.vendor_code}
                        onChange={(e) => handleChange('vendor_code', e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">Vendor Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        placeholder="Enter vendor or company name"
                        value={primary.vendor_name}
                        onChange={(e) => handleChange('vendor_name', e.target.value)}
                    />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className="small fw-bold">GST Number</Form.Label>
                    <Form.Control
                        placeholder="22AAAAA0000A1Z5"
                        value={primary.gst_number}
                        onChange={(e) => handleChange('gst_number', e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">
                        Payment Term
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>To Add: Settings &gt; Payment Terms</Tooltip>}
                        >
                            <span className="ms-1 text-muted" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faCircleQuestion} />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Form.Select
                        value={primary.payment_term}
                        onChange={(e) => handleChange('payment_term', e.target.value)}
                    >
                        <option value="">Select</option>
                        {paymentTerms?.map(pt => (
                            <option key={pt.id} value={pt.id}>{pt.name}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className="small fw-bold">Company ABN</Form.Label>
                    <ABNInput
                        value={primary.company_abn}
                        onChange={(e) => handleChange('company_abn', e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">Company ACN</Form.Label>
                    <ACNInput
                        value={primary.company_acn}
                        onChange={(e) => handleChange('company_acn', e.target.value)}
                    />
                </Col>
            </Row>

            <Row className="mb-3 align-items-end">
                <Col md={3}>
                    <Form.Check 
                        type="switch"
                        label="Tax Free"
                        className="fw-bold fs-7 ms-5 mb-3"
                        checked={primary.is_tax_free}
                        onChange={(e) => handleChange('is_tax_free', e.target.checked)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label className="small fw-bold">Tax %</Form.Label>
                    <Form.Control
                        type="number"
                        value={primary.is_tax_free ? 0 : primary.tax_percent}
                        onChange={(e) => handleChange('tax_percent', e.target.value)}
                        disabled={primary.is_tax_free}
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className="small fw-bold">Currency</Form.Label>
                    <SearchableSelect
                        options={countries}
                        value={primary.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        labelKey="currency"
                        valueKey="currency"
                        placeholder="Search currency..."
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PrimaryDetailsTab;