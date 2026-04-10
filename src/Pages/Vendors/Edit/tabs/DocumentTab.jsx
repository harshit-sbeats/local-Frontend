import React, { useState } from "react";
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { apiFetch } from "../../../../Utils/apiFetch";
import { API_BASE } from "../../../../config/api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const DocumentTab = ({ vendorId, documents, refreshData }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("vendor_id", vendorId);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Mock progress interval
            const interval = setInterval(() => {
                setUploadProgress(prev => (prev >= 95 ? prev : prev + 5));
            }, 100);

            const res = await apiFetch(`${API_BASE}api/vendor/api/upload-document/`, {
                method: "POST",
                body: formData,
                isFormData: true 
            });

            clearInterval(interval);
            setUploadProgress(100);
            
            if (res.status) {
                toast.success("File uploaded successfully");
                refreshData(); // Triggers loadVendor in parent
                e.target.value = "";
            }
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 1000);
        }
    };

    return (
        <div className="p-1 pb-2">
            <Row className="mb-4 align-items-end">
                <Col md={5}>
                    <label className="small fw-bold">Upload New Document</label>
                    <div className="border p-3 rounded bg-light border-dashed">
                        <Form.Control type="file" size="sm" onChange={handleFileUpload} disabled={isUploading} />
                        {isUploading && (
                            <div className="mt-3">
                                <div className="progress" style={{ height: '8px' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            <Table hover align="middle" className="border rounded">
                <thead className="bg-light">
                    <tr className="small text-uppercase">
                        <th>Filename</th><th>Attached Time</th><th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((file, idx) => (
                        <tr key={idx}>
                            <td><i className="far fa-file-alt text-primary me-2"></i>{file.file_name}</td>
                            <td>{new Date(file.created_at).toLocaleString()}</td>
                            <td className="text-end">
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => window.open(file.file_path, '_blank')}><i className="fas fa-download"></i></Button>
                                <Button variant="outline-danger" size="sm"><i className="fas fa-trash-alt"></i></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default DocumentTab;