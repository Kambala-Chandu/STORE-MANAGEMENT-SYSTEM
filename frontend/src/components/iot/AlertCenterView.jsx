import React from 'react';

export const AlertCenterView = ({ alerts, onAcknowledge }) => (
  <div className="bg-[#0B1329] border border-white/10 rounded overflow-hidden">
    <table className="w-full text-left text-white">
      <thead className="bg-white/5 border-b border-white/10">
        <tr>
          <th className="p-4">Severity</th>
          <th className="p-4">Device</th>
          <th className="p-4">Message</th>
          <th className="p-4">Time</th>
          <th className="p-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map(a => (
          <tr key={a.alert_id} className="border-b border-white/5">
            <td className="p-4">
              <span className={`px-2 py-1 text-xs rounded ${a.severity==='Critical'?'bg-red-500/20 text-red-500':a.severity==='High'?'bg-amber-500/20 text-amber-500':'bg-blue-500/20 text-blue-500'}`}>{a.severity}</span>
            </td>
            <td className="p-4">{a.device}</td>
            <td className="p-4">{a.message}</td>
            <td className="p-4">{new Date(a.timestamp).toLocaleString()}</td>
            <td className="p-4">
              {!a.acknowledged && (
                <button onClick={() => onAcknowledge(a.alert_id)} className="text-primary hover:underline">Acknowledge</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
