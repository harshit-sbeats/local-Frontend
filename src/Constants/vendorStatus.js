export const VENDOR_STATUS = [
  { id: 0, name: "Pending", color: "secondary" },
  { id: 1, name: "In Process", color: "info" },
  { id: 2, name: "Active", color: "success" },
  { id: 3, name: "Reject", color: "danger" },
  { id: 4, name: "On Hold", color: "warning" },
];

export const getVendorStatusName = (id) => {
  const status = VENDOR_STATUS.find(s => s.id === Number(id));
  return status 
    ? `<span class="new_badge bg-${status.color}" style="min-width:65px;">${status.name}</span>` 
    : "";
};