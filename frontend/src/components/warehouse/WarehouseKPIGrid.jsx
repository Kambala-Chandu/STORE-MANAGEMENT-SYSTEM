import React from 'react';

export const WarehouseKPIGrid = ({ data }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {data.map((kpi, index) => (
                <div key={index} className="bg-[#0B1329] border border-white/10 p-4 rounded-xl shadow-2xl">
                    <h5 className="text-slate-400 text-xs font-medium mb-2">{kpi.title}</h5>
                    <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
                    <div className={`text-xs ${kpi.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                        {kpi.trend} vs last month
                    </div>
                </div>
            ))}
        </div>
    );
};
