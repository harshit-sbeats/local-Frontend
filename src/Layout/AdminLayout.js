import React, { useState } from 'react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex">
      <div className="flex-fill bg-light">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;