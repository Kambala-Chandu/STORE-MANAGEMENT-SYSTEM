import React from 'react';
export const SCMExportModal = ({ isOpen, onClose }) => isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-[#0B1329] p-4 text-white rounded"><h3 className="mb-4">Export SCM</h3><button onClick={onClose}>Close</button></div></div>
) : null;
