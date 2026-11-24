import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button } from '../ui';

export const ReceivingView = ({ data, handleCreateReceipt }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ PO_number: '', supplier: '', expected_items: 0, dock_door: '', ETA: '' });

    const submit = () => {
        handleCreateReceipt(formData);
        setIsModalOpen(false);
        setFormData({ PO_number: '', supplier: '', expected_items: 0, dock_door: '', ETA: '' });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Inbound Receipts</h3>
                <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded">Create Receipt</Button>
            </div>
            
            <div className="bg-[#0B1329] border border-white/10 rounded-lg overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-white">
                        <tr>
                            <th className="p-4">PO Number</th>
                            <th className="p-4">Supplier</th>
                            <th className="p-4">Dock Door</th>
                            <th className="p-4">ETA</th>
                            <th className="p-4">Expected Items</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-4 text-white font-medium">{item.PO_number}</td>
                                <td className="p-4">{item.supplier}</td>
                                <td className="p-4">{item.dock_door}</td>
                                <td className="p-4">{item.ETA}</td>
                                <td className="p-4">{item.expected_items}</td>
                                <td className="p-4"><Badge>{item.status}</Badge></td>
                                <td className="p-4">
                                    <Button className="text-primary hover:text-white bg-white/5 px-3 py-1 rounded">Process</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#0B1329] p-6 rounded-lg border border-white/10 w-96 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Create Receipt</h3>
                            <div className="space-y-4">
                                <input placeholder="PO Number" value={formData.PO_number} onChange={e=>setFormData({...formData, PO_number: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input placeholder="Supplier" value={formData.supplier} onChange={e=>setFormData({...formData, supplier: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input placeholder="Dock Door" value={formData.dock_door} onChange={e=>setFormData({...formData, dock_door: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input type="date" placeholder="ETA" value={formData.ETA} onChange={e=>setFormData({...formData, ETA: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input type="number" placeholder="Expected Items" value={formData.expected_items} onChange={e=>setFormData({...formData, expected_items: parseInt(e.target.value)})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button onClick={() => setIsModalOpen(false)} className="text-slate-400">Cancel</Button>
                                    <Button onClick={submit} className="bg-primary text-white px-4 py-2 rounded">Save</Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
