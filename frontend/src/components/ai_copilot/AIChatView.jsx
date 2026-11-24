import React from 'react';

export const AIChatView = ({ messages, inputMessage, setInputMessage, onSend, loading }) => (
  <div className="flex flex-col h-[600px] bg-[#0B1329] border border-white/10 rounded relative">
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] p-3 rounded ${m.role === 'user' ? 'bg-white/5 text-white' : 'bg-primary/10 text-white'}`}>
            {m.role === 'ai' && <span className="text-xs text-primary block mb-1">AI Copilot (Conf: {m.confidence}%)</span>}
            <p>{m.content}</p>
          </div>
        </div>
      ))}
      {loading && <div className="text-slate-400">AI is thinking...</div>}
    </div>
    <div className="p-4 border-t border-white/10">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputMessage} 
          onChange={e => setInputMessage(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && onSend(inputMessage)}
          className="flex-1 bg-white/5 border border-white/10 text-white p-2 rounded" 
          placeholder="Ask the enterprise AI..." 
        />
        <button onClick={() => onSend(inputMessage)} className="bg-primary text-white px-4 py-2 rounded">Send</button>
      </div>
      <div className="flex gap-2 mt-2">
        {['What is my inventory status?', 'Show revenue forecast', 'HR anomalies?'].map(q => (
          <button key={q} onClick={() => onSend(q)} className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded hover:bg-white/10">{q}</button>
        ))}
      </div>
    </div>
  </div>
);
