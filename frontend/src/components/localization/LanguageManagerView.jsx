import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const LanguageManagerView = ({ languages, activeLanguage, onActivate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Language Configurations</h3>
          <Button variant="primary" size="sm">Add Language</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Language Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Native Name</th>
                <th className="px-6 py-4">Direction</th>
                <th className="px-6 py-4">Translation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {languages.map((lang, idx) => (
                <tr key={idx} className={`hover:bg-white/5 transition-colors ${activeLanguage === lang.code ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    {activeLanguage === lang.code && <span className="text-primary font-bold">✓</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">{lang.code}</td>
                  <td className="px-6 py-4 font-medium text-white">{lang.name}</td>
                  <td className="px-6 py-4 text-slate-400">{lang.native_name}</td>
                  <td className="px-6 py-4">{lang.direction}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-white/10 rounded-full h-1.5 w-24">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${lang.translated_pct}%` }}></div>
                      </div>
                      <span className="text-xs">{lang.translated_pct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={lang.status === 'Active' ? 'success' : 'neutral'}>{lang.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={activeLanguage === lang.code ? 'outline' : 'neutral'}
                      size="sm"
                      onClick={() => onActivate(lang.code)}
                      disabled={activeLanguage === lang.code}
                    >
                      {activeLanguage === lang.code ? 'Active' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
