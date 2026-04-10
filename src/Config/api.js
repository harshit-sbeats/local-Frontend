export const API_BASE =
  process.env.REACT_APP_API_BASE ??
  window.location.origin + "/";

export const API_ENDPOINTS = {
  vendors: `${API_BASE}api/vendor/vendor_api_lists`,
  countries: `${API_BASE}api/countries/lists`,
  org_warehouses: `${API_BASE}api/sb_warehouses/lists`,
  shipping_providers: `${API_BASE}api/shipping_providers/lists`,
  payment_terms: `${API_BASE}api/payment_terms/lists`,
  
  save_item_shipping: `${API_BASE}api/purchaseorder/api/purchase-order/save_item_shipping`,
  save_purchase_invocies: `${API_BASE}api/purchaseorder/api/purchase-order/save_purchase_invoice`,
  get_invoice_detail: `${API_BASE}api/purchaseorder/api/purchase-order/save_purchase_invoice`,
  delete_purchase_invocies: `${API_BASE}api/purchaseorder/api/purchase-order/delete_invoice/`,
  approve_purchase_order: `${API_BASE}api/purchaseorder/approve_and_create_receive/`,
  get_po_details: `${API_BASE}api/purchaseorder/api/get_po_details/`,
  get_po_receive_details: `${API_BASE}api/purchaseorder/api/get_po_receive_details`,
  DELETE_PURCHASE_ORDER : `${API_BASE}api/purchaseorder/delete/`,
  UPDATE_PO_STATUS : `${API_BASE}api/purchaseorder/api/update_po_status`,

  GET_VENDOR_DETAILS: `${API_BASE}api/vendor/vendor_details`,
  save_vendor_details: `${API_BASE}api/vendor/api/save_vendor_details`,

  PRODUCT_SEARCH : `${API_BASE}api/product/api/search-products/`,

  DELETE_PRODUCT_ATTRIBUTE : `${API_BASE}api/product_api/api/attributes/delete/`,
  LIST_PRODUCT_ATTRIBUTES : `${API_BASE}api/product_api/api/attributes/listing`,
  CREATE_PRODUCT_ATTRIBUTE : `${API_BASE}api/product_api/api/attributes/create`,
  UPDATE_PRODUCT_ATTRIBUTE : `${API_BASE}api/product_api/api/attributes/update/`,

  API_ME : `${API_BASE}api/me/`,
  API_LOGIN : `${API_BASE}api/login`,
  API_LOGOUT : `${API_BASE}api/logout/`,
  API_REFRESH : `${API_BASE}api/refresh/`,

  PO_LISTING : `${API_BASE}api/purchaseorder/api/allpurchases`,
};