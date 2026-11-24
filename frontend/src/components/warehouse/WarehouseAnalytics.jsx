import React from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const WarehouseAnalytics = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0B1329] border border-white/10 p-6 rounded-xl shadow-2xl">
                    <h4 className="text-lg font-bold text-white mb-4">Daily Throughput Trend</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.throughput}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="day" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                                <Legend />
                                <Area type="monotone" dataKey="inbound" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                                <Area type="monotone" dataKey="outbound" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#0B1329] border border-white/10 p-6 rounded-xl shadow-2xl">
                    <h4 className="text-lg font-bold text-white mb-4">Picking Accuracy % Trend</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.picking_accuracy}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="day" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" domain={['dataMin - 1', 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                                <Line type="monotone" dataKey="accuracy" stroke="#8B5CF6" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-[#0B1329] border border-white/10 p-6 rounded-xl shadow-2xl">
                <h4 className="text-lg font-bold text-white mb-4">Utilization by Zone</h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.utilization}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="zone" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            <Bar dataKey="used" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
