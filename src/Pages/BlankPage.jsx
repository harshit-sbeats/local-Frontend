import React, { useState, useEffect, useCallback, useMemo } from "react";

const BlankPage = () => {
   
    return (
        <div className="container-fluid p-4 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h5><i className="fas fa-edit me-2 text-primary"></i>Blank Page</h5>
                <div>
                </div>
            </div>
        </div>
    );
};

export default BlankPage;