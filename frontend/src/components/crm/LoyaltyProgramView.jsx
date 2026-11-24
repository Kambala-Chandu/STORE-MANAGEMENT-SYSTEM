import React from 'react';
import {
  Award,
  Star,
  Gift,
  Tag,
  DollarSign,
  Users,
  CheckCircle,
  Copy,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export function LoyaltyProgramView({ loyalty = {} }) {
  const { addToast } = useToast();

  const tiers = loyalty.tiers || [
    { name: 'Bronze Entry', min_spend: 0, multiplier: '1.0x', members: 2100, color: 'text-amber-600' },
    { name: 'Silver Preferred', min_spend: 1000, multiplier: '1.25x', members: 850, color: 'text-slate-300' },
    { name: 'Gold VIP', min_spend: 5000, multiplier: '1.5x', members: 380, color: 'text-amber-400' },
    { name: 'Platinum Enterprise', min_spend: 20000, multiplier: '2.0x', members: 120, color: 'text-cyan-400' }
  ];

  const coupons = loyalty.active_coupons || [
    { code: 'VIPFALL20', discount: '20% Off Peripherals', expires: '2026-11-30', uses: 142 },
    { code: 'BULKSHIPFREE', discount: 'Free Freight on Orders > $2,000', expires: '2026-12-31', uses: 89 }
  ];

  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText?.(code);
    addToast({
      title: 'Coupon Code Copied',
      message: `Code "${code}" copied to clipboard.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Enrolled Members</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {(loyalty.total_members || 3450).toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-400">Active loyalty participants</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Points Issued (YTD)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Star className="w-4 h-4 fill-emerald-400" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            {(loyalty.points_issued_total || 485000).toLocaleString()} pts
          </div>
          <p className="mt-1 text-xs text-slate-400">Customer purchase rewards</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Points Redeemed</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">
            {(loyalty.points_redeemed_total || 312000).toLocaleString()} pts
          </div>
          <p className="mt-1 text-xs text-slate-400">64.3% redemption velocity</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Points Balance Liability</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">
            ${(loyalty.outstanding_liability || 17300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">GL deferred liability reserve</p>
        </div>
      </div>

      {/* Membership Tiers Grid */}
      <div>
        <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-primary" />
          Enterprise Membership Tiers & Benefit Matrix
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className={`text-base font-extrabold ${t.color || 'text-white'}`}>
                  {t.name}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/5 text-primary">
                  {t.multiplier} Points
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div>Min Spend: <strong className="text-white font-mono">${t.min_spend.toLocaleString()}</strong></div>
                <div>Enrolled Members: <strong className="text-white font-mono">{t.members}</strong></div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                Priority support queue + VIP invitations included.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Discount Coupons */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              Active Promotional Discount Codes & Vouchers
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Campaign promo vouchers redeemable at POS registers and B2B checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#050A16] border border-dashed border-white/20 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-primary tracking-wider">
                    {c.code}
                  </span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-white font-medium mt-1">{c.discount}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Expires {c.expires} • {c.uses} redemptions logged
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCoupon(c.code)}
                className="text-xs border-white/10 text-slate-300 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
