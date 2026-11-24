import React from 'react';

export const RecommendationsView = ({ recommendations }) => (
  <div className="bg-[#0B1329] border border-white/10 rounded overflow-hidden">
    <table className="w-full text-left text-white">
      <thead className="bg-white/5 border-b border-white/10">
        <tr>
          <th className="p-4">Module</th>
          <th className="p-4">Priority</th>
          <th className="p-4">Description</th>
          <th className="p-4">Potential Impact</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {recommendations.map(r => (
          <tr key={r.id} className="border-b border-white/5">
            <td className="p-4">{r.module}</td>
            <td className="p-4"><span className="px-2 py-1 bg-white/10 rounded text-xs">{r.priority}</span></td>
            <td className="p-4">{r.description}</td>
            <td className="p-4 text-green-400">{r.potential_impact}</td>
            <td className="p-4 flex gap-2">
              <button className="text-primary hover:underline">Accept</button>
              <button className="text-slate-400 hover:underline">Dismiss</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
