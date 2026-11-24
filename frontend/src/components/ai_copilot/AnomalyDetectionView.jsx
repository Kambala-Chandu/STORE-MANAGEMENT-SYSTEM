import React from 'react';

export const AnomalyDetectionView = ({ anomalies }) => (
  <div className="bg-[#0B1329] border border-white/10 rounded overflow-hidden">
    <table className="w-full text-left text-white">
      <thead className="bg-white/5 border-b border-white/10">
        <tr>
          <th className="p-4">Module</th>
          <th className="p-4">Description</th>
          <th className="p-4">Detected At</th>
          <th className="p-4">Severity</th>
          <th className="p-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {anomalies.map(a => (
          <tr key={a.id} className="border-b border-white/5">
            <td className="p-4">{a.module}</td>
            <td className="p-4">{a.description}</td>
            <td className="p-4">{new Date(a.detected_at).toLocaleString()}</td>
            <td className="p-4">{a.severity}</td>
            <td className="p-4">{a.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
