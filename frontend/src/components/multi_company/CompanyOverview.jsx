import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const CompanyOverview = ({ companies, activeCompany, onSwitchCompany }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {companies.map((company) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-[#0B1329] p-6 rounded-xl border border-white/10 flex flex-col gap-4 ${
            activeCompany === company.id.toString() ? 'ring-2 ring-primary' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {company.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{company.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{company.country === 'US' ? '🇺🇸' : company.country === 'UK' ? '🇬🇧' : '🇦🇪'}</span>
                <span>{company.currency}</span>
              </div>
            </div>
            <div className="ml-auto">
              <Badge variant={company.status === 'Active' ? 'success' : 'neutral'}>{company.status}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-slate-400">Revenue YTD</p>
              <p className="text-lg font-semibold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(company.revenue_ytd)}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-slate-400">Branches</p>
              <p className="text-lg font-semibold text-white">{company.branches_count}</p>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-white/10">
            <Button
              variant={activeCompany === company.id.toString() ? 'primary' : 'outline'}
              className="w-full"
              onClick={() => onSwitchCompany(company.id.toString())}
            >
              {activeCompany === company.id.toString() ? 'Active Company' : 'Switch to Company'}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
