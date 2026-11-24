import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button } from '../ui';

export const PickingView = ({ data, handleCreatePickOrder }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ order_ref: '', items_to_pick: 0, picker_name: '', priority: 'Normal', wave_batch: '' });

    const submit = () => {
        handleCreatePickOrder(formData);
        setIsModalOpen(false);
        setFormData({ order_ref: '', items_to_pick: 0, picker_name: '', priority: 'Normal', wave_batch: '' });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Pick Orders</h3>
                <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded">Create Pick Order</Button>
            </div>
            
            <div className="bg-[#0B1329] border border-white/10 rounded-lg overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-white">
                        <tr>
                            <th className="p-4">Order Ref</th>
                            <th className="p-4">Wave Batch</th>
                            <th className="p-4">Picker</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-4 text-white font-medium">{item.order_ref}</td>
                                <td className="p-4">{item.wave_batch}</td>
                                <td className="p-4">{item.picker_name}</td>
                                <td className="p-4">{item.items_to_pick}</td>
                                <td className="p-4">
                                    <Badge className={`${item.priority==='Urgent'?'bg-red-500/20 text-red-500':item.priority==='High'?'bg-orange-500/20 text-orange-500':''}`}>{item.priority}</Badge>
                                </td>
                                <td className="p-4"><Badge>{item.status}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#0B1329] p-6 rounded-lg border border-white/10 w-96 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Create Pick Order</h3>
                            <div className="space-y-4">
                                <input placeholder="Order Ref" value={formData.order_ref} onChange={e=>setFormData({...formData, order_ref: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input placeholder="Wave Batch" value={formData.wave_batch} onChange={e=>setFormData({...formData, wave_batch: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input placeholder="Picker Name" value={formData.picker_name} onChange={e=>setFormData({...formData, picker_name: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <input type="number" placeholder="Items to Pick" value={formData.items_to_pick} onChange={e=>setFormData({...formData, items_to_pick: parseInt(e.target.value)})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white" />
                                <select value={formData.priority} onChange={e=>setFormData({...formData, priority: e.target.value})} className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white">
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
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
