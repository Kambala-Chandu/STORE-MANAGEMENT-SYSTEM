import React from 'react';
export const MobileExportModal = ({ isOpen, onClose }) => isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#0B1329] p-6 rounded border border-white/10 text-white w-96">
            <h2 className="text-xl mb-4">Export Mobile Data</h2>
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 rounded w-full">Close</button>
        </div>
    </div>
) : null;
