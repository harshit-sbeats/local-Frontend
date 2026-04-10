export const menuConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "fas fa-tachometer-alt",
    path: "/dashboard",
  },

  {
    key: "vendors",
    label: "Vendors",
    icon: "fas fa-users",
    prefix: "/vendor",
    children: [
      {
        label: "Add Vendor",
        path: "/vendor/addnewvendor",
      },
      {
        label: "View Vendors",
        path: "/vendor/vendors",
      },
      {
        label: "Import / Export",
        path: null, // future
      },
    ],
  },

  {
    key: "purchase_orders",
    label: "Purchase Orders",
    icon: "fas fa-shopping-bag",
    prefix: "/purchaseorder",
    children: [
      {
        label: "Add Purchase",
        action: "add_purchase", // custom action
      },
      {
        label: "View Purchase",
        path: "/purchaseorder/listing",
      },
      {
        label: "Purchase Order Kanban",
        path: "/purchaseorder/kanbanlisting",
      },
      {
        label: "Import / Export",
        path: null, // future
      },
    ],
  },

  {
    key: "products",
    label: "Products",
    icon: "fas fa-boxes",
    prefix: "/product",
    children: [
      { label: "All Products", path: "/product/allproducts" },
      { label: "Brands", path: "/product/brands" },
      { label: "Categories", path: "/product/categories" },
      { label: "Manufacturers", path: "/product/manufacturers" },
      { label: "Attributes", path: "/product/attributes" },
      { label: "Unit Of Measurement", path: "/product/unit_of_measurements" },
    ],
  },

  {
    key: "security",
    label: "Security",
    icon: "fas fa-shield-alt",
    prefix: "/security",
    children: [
      { label: "Users", path: "/security/users" },
      { label: "Roles", path: "/security/roles" },
    ],
  },

  {
    key: "settings",
    label: "Settings",
    icon: "fas fa-cog",
    prefix: "/settings",
    children: [
      { label: "Countries", path: "/settings/countries" },
      { label: "Payment Terms", path: "/settings/payment_terms" },
      { label: "Warehouses", path: "/settings/warehouses" },
      { label: "Shipping Providers", path: "/settings/shipping_providers" },
    ],
  },
];
