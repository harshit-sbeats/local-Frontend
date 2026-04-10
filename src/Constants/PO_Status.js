export const PO_STATUS = [
  { id: -1, name: "Draft", color: "secondary", badge: "badge-secondary" },    
  { id: 0,  name: "Parked", color: "warning",   badge: "badge-warning" },    
  { id: 1,  name: "Placed", color: "primary",   badge: "badge-primary" },        
  { id: 2,  name: "Costed", color: "info",      badge: "badge-info" },     
  { id: 3,  name: "Receipted", color: "success", badge: "badge-success" }, 
  { id: 4,  name: "Completed", color: "dark",    badge: "badge-dark" },
];
    
export const PO_RECEIVE_STATUS = [
  { id: 0,  name: "Pending", color: "warning",   badge: "badge-warning" },    
  { id: 1,  name: "Placed", color: "primary",   badge: "badge-primary" },        
  { id: 2,  name: "Partially Received", color: "info",      badge: "badge-info" },     
  { id: 3,  name: "Completed", color: "success", badge: "badge-success" }, 
  { id: 4,  name: "Delivered", color: "dark",    badge: "badge-dark" },
  { id: 5,  name: "Cancelled", color: "dark",    badge: "badge-dark" },
];

export const getPOStatusName = (statusid) => {
  const status = PO_STATUS.find(s => s.id === Number(statusid));
  return status 
    ? `<span class="badge bg-${status.color}">${status.name}</span>` 
    : "";
};
