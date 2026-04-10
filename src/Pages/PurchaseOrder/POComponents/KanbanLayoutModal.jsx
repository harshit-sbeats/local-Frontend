import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Select from "react-select";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGripVertical, faLock, faCheckCircle, faTimesCircle, 
  faArrowUp, faArrowDown, faSave 
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../Utils/apiFetch";
import { API_BASE } from "../../../Config/api";

const KanbanLayoutModal = ({ show, onHide, columns, onRefresh }) => {
  const [activeCols, setActiveCols] = useState([]);
  const [inactiveCols, setInactiveCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  // Configuration State
  const [sortOrder, setSortOrder] = useState({ value: "order_date", label: "Delivery Date" });
  const [sortDir, setSortDir] = useState("asc");
  const [cardContent, setCardContent] = useState([
    { value: "vendor_code", label: "Vendor Code", isFixed: true },
    { value: "vendor_name", label: "Vendor Name", isFixed: true }
  ]);

  const sortOptions = [
    { value: "order_date", label: "Delivery Date" },
    { value: "po_number", label: "Order Number" },
    { value: "vendor_name", label: "Vendor Name" }
  ];

  const contentOptions = [
    { value: "vendor_code", label: "Vendor Code", isFixed: true },
    { value: "vendor_name", label: "Vendor Name", isFixed: true },
    { value: "delivery_name", label: "Warehouse" },
    { value: "total_val", label: "Total" },
    { value: "supplier_ref", label: "Supplier Ref" }
  ];

  // --- API DATA FETCHING ---
  const fetchSavedConfig = useCallback(async () => {
    setIsInitialLoad(true);
    try {
      const res = await apiFetch(`${API_BASE}api/purchaseorder/api/kanbanlist/get-config-layout`);
      
      if (res.status && res.data) {
        const saved = res.data;

        // 1. Map Columns (Active/Inactive)
        if (saved.active_columns && saved.active_columns.length > 0) {
          const activeIds = saved.active_columns.map(c => c.id);
          // Match database IDs against valid 'columns' prop
          const active = columns.filter(col => activeIds.includes(col.id))
                               .sort((a, b) => activeIds.indexOf(a.id) - activeIds.indexOf(b.id));
          const inactive = columns.filter(col => !activeIds.includes(col.id));
          
          setActiveCols(active);
          setInactiveCols(inactive);
        } else {
          setDefaultLayout();
        }

        // 2. Set Sort Config
        const savedSort = sortOptions.find(opt => opt.value === saved.sort_by);
        if (savedSort) setSortOrder(savedSort);
        if (saved.sort_direction) setSortDir(saved.sort_direction);

        // 3. Set Card Content (Enforce Fixed items)
        if (saved.additional_content) {
          const selectedContent = contentOptions.filter(opt => 
            saved.additional_content.includes(opt.value) || opt.isFixed
          );
          setCardContent(selectedContent);
        }
      } else {
        setDefaultLayout();
      }
    } catch (err) {
      console.error("Config fetch failed, using defaults", err);
      setDefaultLayout();
    } finally {
      setIsInitialLoad(false);
    }
  }, [columns]);

  const setDefaultLayout = () => {
    setActiveCols(columns.filter((c) => c.canDrop));
    setInactiveCols(columns.filter((c) => !c.canDrop));
  };

  useEffect(() => {
    if (show) fetchSavedConfig();
  }, [show, fetchSavedConfig]);

  // --- HANDLERS ---
  const handleContentChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'remove-value' || actionMeta.action === 'pop-value') {
      if (actionMeta.removedValue.isFixed) return;
    } else if (actionMeta.action === 'clear') {
      newValue = contentOptions.filter((v) => v.isFixed);
    }
    setCardContent(newValue);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        active_columns: activeCols.map((c, index) => ({ id: c.id, order: index })),
        inactive_columns: inactiveCols.map((c) => c.id),
        sort_by: sortOrder.value,
        sort_direction: sortDir,
        additional_content: cardContent.map(c => c.value)
      };

      const res = await apiFetch(`${API_BASE}api/purchaseorder/api/kanbanlist/save-config-layout`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.status) {
        Swal.fire("Success", "Kanban layout saved", "success");
        if (onRefresh) onRefresh();
        onHide();
      }
    } catch (err) {
      Swal.fire("Error", "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = source.droppableId === "active" ? activeCols : inactiveCols;
    const destList = destination.droppableId === "active" ? activeCols : inactiveCols;
    
    const sourceClone = Array.from(sourceList);
    const [removed] = sourceClone.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceClone.splice(destination.index, 0, removed);
      source.droppableId === "active" ? setActiveCols(sourceClone) : setInactiveCols(sourceClone);
    } else {
      const destClone = Array.from(destList);
      destClone.splice(destination.index, 0, removed);
      setActiveCols(source.droppableId === "active" ? sourceClone : destClone);
      setInactiveCols(source.droppableId === "inactive" ? sourceClone : destClone);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-0 bg-light">
        <Modal.Title className="fw-bold fs-5 text-uppercase">
          Kanban Layout Configuration
          {isInitialLoad && <div className="spinner-border spinner-border-sm ms-3 text-primary" />}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {isInitialLoad ? (
          <div className="text-center py-5">
            <div className="spinner-border text-teal" />
            <p className="mt-2 text-muted small">Synchronizing your layout...</p>
          </div>
        ) : (
          <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="fw-bold small text-muted text-uppercase mb-2">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-danger me-2" /> Inactive
                  </label>
                  <Droppable droppableId="inactive">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="rounded-3 p-2 bg-light border-dashed" style={{ minHeight: "300px", border: "2px dashed #ccc" }}>
                        {inactiveCols.map((col, index) => <DraggableItem key={col.id} item={col} index={index} />)}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                <div className="col-md-6">
                  <label className="fw-bold small text-muted text-uppercase mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Active Order
                  </label>
                  <Droppable droppableId="active">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="rounded-3 p-2 bg-white border" style={{ minHeight: "300px", borderColor: "#008080" }}>
                        {activeCols.map((col, index) => <DraggableItem key={col.id} item={col} index={index} showOrder />)}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </DragDropContext>

            <hr />

            <div className="row mt-4">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Default Sort Order</Form.Label>
                  <div className="d-flex gap-2">
                    <div className="flex-fill">
                      <Select options={sortOptions} value={sortOrder} onChange={setSortOrder} />
                    </div>
                    <Button variant="light" className="border shadow-sm px-3" onClick={() => setSortDir(p => p === "asc" ? "desc" : "asc")}>
                      <FontAwesomeIcon icon={sortDir === "asc" ? faArrowUp : faArrowDown} className="text-primary" />
                    </Button>
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Additional Card Content</Form.Label>
                  <Select 
                    isMulti 
                    options={contentOptions} 
                    value={cardContent} 
                    onChange={handleContentChange} 
                    styles={{ multiValueRemove: (base, state) => state.data.isFixed ? { ...base, display: 'none' } : base }}
                  />
                </Form.Group>
              </div>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 bg-light">
        <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
        <Button 
          variant="primary" 
          className="px-5 fw-bold" 
          style={{ backgroundColor: "#008080", border: "none" }}
          onClick={handleSave}
          disabled={loading || isInitialLoad}
        >
          {loading ? <i className="fas fa-spinner fa-spin me-2"></i> : <FontAwesomeIcon icon={faSave} className="me-2" />}
          Save Layout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DraggableItem = ({ item, index, showOrder }) => (
  <Draggable draggableId={item.id} index={index}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`d-flex align-items-center p-2 mb-2 bg-white border rounded shadow-sm ${snapshot.isDragging ? "shadow-lg border-primary" : ""}`}>
        {showOrder && <span className="badge bg-dark text-white me-2">{index + 1}</span>}
        <div className="me-2" style={{ width: "4px", height: "20px", backgroundColor: item.color, borderRadius: "2px" }} />
        <span className="flex-fill fw-bold small text-dark text-truncate">{item.title}</span>
        {!item.canDrop && <FontAwesomeIcon icon={faLock} className="me-2 small text-muted opacity-50" />}
        <FontAwesomeIcon icon={faGripVertical} className="text-muted opacity-50" />
      </div>
    )}
  </Draggable>
);

export default KanbanLayoutModal;