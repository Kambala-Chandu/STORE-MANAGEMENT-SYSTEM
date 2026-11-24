import React from 'react';

export const DeviceDashboardView = ({ devices }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {devices.map(d => (
      <div key={d.device_id} className="p-4 bg-[#0B1329] border border-white/10 rounded shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-bold">{d.device_id}</h3>
          <span className={`w-3 h-3 rounded-full ${d.status==='Online'?'bg-green-500':d.status==='Offline'?'bg-red-500':'bg-amber-500'}`}></span>
        </div>
        <p className="text-slate-400">Type: {d.type}</p>
        <p className="text-slate-400">Location: {d.location}</p>
        <div className="w-full bg-white/10 rounded h-2 mt-2">
          <div className="bg-primary h-2 rounded" style={{width: `${d.battery_pct}%`}}></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">Battery: {d.battery_pct}% | Last ping: {new Date(d.last_ping).toLocaleTimeString()}</p>
      </div>
    ))}
  </div>
);
