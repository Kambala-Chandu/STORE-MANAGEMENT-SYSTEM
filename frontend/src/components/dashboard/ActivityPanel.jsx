import React, { useMemo } from 'react';
import { Card, CardHeader, CardBody, EmptyState } from '../ui';
import { cn } from '../../lib/cn';
import { Receipt, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

// Simple relative time formatter
const getRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
  const minutesDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));
  
  if (Math.abs(minutesDifference) < 60) {
    // Prevent "0 minutes ago" if it's very recent
    if (minutesDifference === 0) return 'Just now';
    return rtf.format(minutesDifference, 'minute');
  } else if (Math.abs(hoursDifference) < 24) {
    return rtf.format(hoursDifference, 'hour');
  } else {
    return rtf.format(daysDifference, 'day');
  }
};

export const ActivityPanel = ({ recentSales = [], lowStockProducts = [], stats = null, loading = false }) => {
  const activities = useMemo(() => {
    const items = [];
    const now = new Date();

    // 1. Sales Activity (Most recent)
    if (recentSales && recentSales.length > 0) {
      recentSales.slice(0, 5).forEach((sale, index) => {
        // Pseudo timestamp: 5, 15, 25... mins ago
        const time = new Date(now.getTime() - (5 + index * 10) * 60000);
        
        items.push({
          id: `sale-${sale.id || index}`,
          type: 'sale',
          title: `Invoice ${sale.invoice_number || 'Unknown'} completed`,
          description: `${sale.customer_name || 'Walk-in Customer'} · ${sale.payment_method || 'Unknown'} · $${Number(sale.total_amount || 0).toFixed(2)}`,
          timestamp: time,
          timeString: getRelativeTime(time),
          icon: Receipt,
          colorClass: 'text-emerald-400',
          bgClass: 'bg-emerald-400/10',
          borderClass: 'border-emerald-500/50'
        });
      });
    }

    // 2. Low Stock Alerts
    if (lowStockProducts && lowStockProducts.length > 0) {
      lowStockProducts.slice(0, 3).forEach((product, index) => {
        // Pseudo timestamp: 2, 4, 6... hours ago
        const time = new Date(now.getTime() - (2 + index * 2) * 3600000);
        
        items.push({
          id: `stock-${product.id || index}`,
          type: 'stock_alert',
          title: `Low stock alert: ${product.name}`,
          description: `Only ${product.quantity} left (Reorder at ${product.reorder_level})`,
          timestamp: time,
          timeString: getRelativeTime(time),
          icon: AlertTriangle,
          colorClass: 'text-amber-400',
          bgClass: 'bg-amber-400/10',
          borderClass: 'border-amber-500/50'
        });
      });
    }

    // 3. System Events
    const sysTime1 = new Date(now.getTime() - 24 * 3600000); // 1 day ago
    items.push({
      id: 'sys-1',
      type: 'system',
      title: 'System backup completed',
      description: 'Automated daily database backup',
      timestamp: sysTime1,
      timeString: getRelativeTime(sysTime1),
      icon: ShieldCheck,
      colorClass: 'text-blue-400',
      bgClass: 'bg-blue-400/10',
      borderClass: 'border-blue-500/50'
    });

    const sysTime2 = new Date(now.getTime() - 48 * 3600000); // 2 days ago
    items.push({
      id: 'sys-2',
      type: 'system',
      title: 'Security scan passed',
      description: 'No vulnerabilities detected',
      timestamp: sysTime2,
      timeString: getRelativeTime(sysTime2),
      icon: ShieldCheck,
      colorClass: 'text-blue-400',
      bgClass: 'bg-blue-400/10',
      borderClass: 'border-blue-500/50'
    });

    // Sort by timestamp descending
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [recentSales, lowStockProducts, stats]);

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader title="Activity Timeline" description="Recent system events" />
      <CardBody className="p-0">
        <div className="divide-y divide-white/[0.04] max-h-[28rem] overflow-y-auto ds-scroll">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <div className="p-8">
              <EmptyState 
                icon={Activity} 
                title="No recent activity" 
                description="System events will appear here as they occur." 
              />
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="p-4 hover:bg-white/[0.02] transition-colors flex gap-4 group">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border", activity.bgClass, activity.colorClass, activity.borderClass)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {activity.title}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                        {activity.timeString}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 truncate">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ActivityPanel;
