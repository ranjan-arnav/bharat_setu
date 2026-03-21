'use client';

import { useAppStore } from '@/lib/store';
import { getHotspots, getPredictions } from '@/lib/intelligence';

const WARD_INTENSITIES = [0.2,0.8,0.5,0.3,0.9,0.1,0.6,0.4,0.7,0.2,0.5,0.8,0.3,0.6,0.9,0.1,0.4,0.7,0.5,0.2,0.8,0.3,0.6,0.4];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function GovDashboard() {
  const { citizenProfile } = useAppStore();
  const pendingCases = 5;
  const criticalCases = 2;

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white overflow-y-auto pb-6 no-scrollbar">
      <div className="p-4 space-y-4">

        {/* ═══ OFFICER GREETING ═══ */}
        <div className="bg-gradient-to-r from-[#138808]/10 via-[#138808]/5 to-transparent dark:from-[#138808]/15 dark:via-[#138808]/5 rounded-2xl p-4 border border-[#138808]/15">
          <p className="text-[10px] text-[#138808] font-bold uppercase tracking-widest mb-1">{getGreeting()}</p>
          <h2 className="text-lg font-black leading-tight">{citizenProfile?.name || 'District Magistrate'}</h2>
          <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1">{citizenProfile?.district || 'Lucknow'} District · Government Panel</p>
          <div className="flex gap-2 mt-3">
            <div className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-[9px] font-black text-red-500">{criticalCases} Critical</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-[9px] font-black text-amber-500">{pendingCases} Pending</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="text-[9px] font-bold text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> LIVE
              </span>
            </div>
          </div>
        </div>

        {/* ═══ DAILY BRIEFING ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#FF9933]">summarize</span>
            Daily Briefing
          </h4>
          <div className="space-y-2">
            {[
              { text: 'Ward 12 drainage issue escalated — Sub-Inspector deployed', icon: 'priority_high', color: '#EF4444' },
              { text: 'PM-KISAN installment for 1,240 farmers processed today', icon: 'agriculture', color: '#FF9933' },
              { text: 'SOS trigger from Ward 14 — Police response dispatched', icon: 'emergency', color: '#EF4444' },
              { text: '87% resolution rate maintained — above state average', icon: 'trending_up', color: '#10B981' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[14px] mt-0.5" style={{ color: item.color }}>{item.icon}</span>
                <p className="text-[11px] leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ QUICK ACTIONS ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#138808]">bolt</span>
            Quick Actions
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: 'emergency', label: 'Emergency Alert', color: '#EF4444' },
              { icon: 'water_drop', label: 'Water Advisory', color: '#06B6D4' },
              { icon: 'do_not_disturb_on', label: 'Road Closure', color: '#F59E0B' },
              { icon: 'power_off', label: 'Power Outage', color: '#8B5CF6' },
              { icon: 'shield', label: 'Curfew Notice', color: '#EF4444' },
              { icon: 'health_and_safety', label: 'Health Alert', color: '#10B981' },
              { icon: 'school', label: 'School Closure', color: '#3B82F6' },
              { icon: 'celebration', label: 'Festival Alert', color: '#FF9933' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all active:scale-95">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: action.color + '15' }}>
                  <span className="material-symbols-outlined text-lg" style={{ color: action.color }}>{action.icon}</span>
                </div>
                <span className="text-[8px] font-bold text-slate-600 dark:text-gray-300 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══ KPI GRID ═══ */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Pending', value: '5', icon: 'pending_actions', color: '#F59E0B' },
            { label: 'Critical', value: '2', icon: 'priority_high', color: '#EF4444' },
            { label: 'Resolved', value: '186', icon: 'task_alt', color: '#10B981' },
            { label: 'Citizens', value: '1,247', icon: 'groups', color: '#3B82F6' },
            { label: 'Resolution', value: '87%', icon: 'trending_up', color: '#138808' },
            { label: 'Satisfaction', value: '4.2', icon: 'sentiment_satisfied', color: '#8B5CF6' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-3 relative overflow-hidden shadow-sm dark:shadow-none">
              <div className="absolute top-0 right-0 w-10 h-10 rounded-full blur-2xl opacity-20" style={{ backgroundColor: kpi.color }} />
              <span className="material-symbols-outlined text-[14px]" style={{ color: kpi.color }}>{kpi.icon}</span>
              <p className="text-xl font-black mt-0.5">{kpi.value}</p>
              <p className="text-[8px] text-slate-400 dark:text-gray-500 font-bold uppercase">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* ═══ WARD HEATMAP ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#FF9933]">map</span>
            Ward Grievance Heatmap
          </h4>
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 24 }, (_, i) => {
              const intensity = WARD_INTENSITIES[i];
              return (
                <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold border border-black/5 dark:border-white/5"
                  style={{
                    backgroundColor: intensity > 0.7 ? '#EF444430' : intensity > 0.4 ? '#F59E0B20' : '#10B98115',
                    color: intensity > 0.7 ? '#EF4444' : intensity > 0.4 ? '#F59E0B' : '#10B981',
                  }}>W{i + 1}</div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 mt-2.5">
            <span className="flex items-center gap-1 text-[8px] text-slate-500 dark:text-gray-500"><span className="w-2 h-2 rounded bg-[#10B98130]" /> Low</span>
            <span className="flex items-center gap-1 text-[8px] text-slate-500 dark:text-gray-500"><span className="w-2 h-2 rounded bg-[#F59E0B30]" /> Medium</span>
            <span className="flex items-center gap-1 text-[8px] text-slate-500 dark:text-gray-500"><span className="w-2 h-2 rounded bg-[#EF444430]" /> High</span>
          </div>
        </div>

        {/* ═══ REVENUE & BUDGET ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#3B82F6]">account_balance_wallet</span>
            Revenue & Budget
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-[#138808]/5 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-[#138808]">₹1.2Cr</p>
              <p className="text-[8px] text-slate-400 dark:text-gray-500 font-bold">Revenue Collected</p>
            </div>
            <div className="bg-[#3B82F6]/5 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-[#3B82F6]">₹1.08Cr</p>
              <p className="text-[8px] text-slate-400 dark:text-gray-500 font-bold">Budget Utilized</p>
            </div>
          </div>
          {[
            { dept: 'Infrastructure', allocated: 45, spent: 31 },
            { dept: 'Sanitation', allocated: 28, spent: 22 },
            { dept: 'Health Services', allocated: 35, spent: 12 },
            { dept: 'Education', allocated: 22, spent: 18 },
          ].map((b, i) => (
            <div key={i} className="mb-2.5 last:mb-0">
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] font-bold">{b.dept}</span>
                <span className="text-[9px] text-slate-400 dark:text-gray-500">₹{b.spent}L / ₹{b.allocated}L</span>
              </div>
              <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#138808] to-[#10B981]" style={{ width: `${(b.spent / b.allocated) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ═══ CIVIC INTELLIGENCE INSIGHTS ═══ */}
        <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-[#8B5CF6]/10 border border-[#8B5CF6]/15 rounded-2xl p-4">
          <h4 className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            Civic Intelligence Insights
            <span className="ml-auto text-[8px] font-bold text-green-500 flex items-center gap-1 bg-green-500/10 px-1.5 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> AI
            </span>
          </h4>
          <div className="space-y-2 mb-3">
            {getHotspots().slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                <span className={`text-sm font-black ${
                  h.severity === 'critical' ? 'text-red-500' : h.severity === 'high' ? 'text-orange-500' : 'text-amber-500'
                }`}>{h.count}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate">{h.category} — {h.ward}</p>
                  <p className="text-[8px] text-slate-500 dark:text-gray-400">{h.location} · {h.trend === 'rising' ? '↑ Rising' : h.trend === 'declining' ? '↓ Declining' : '→ Stable'}</p>
                </div>
              </div>
            ))}
          </div>
          {(() => {
            const p = getPredictions()[0];
            return p ? (
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-500/5 border border-red-500/15">
                <span className="material-symbols-outlined text-lg text-red-500">warning</span>
                <div className="flex-1">
                  <p className="text-[10px] font-bold">⚡ Prediction: {p.category} — {p.area}</p>
                  <p className="text-[8px] text-slate-500 dark:text-gray-400">{p.probability}% likelihood in {p.timeframe}</p>
                </div>
              </div>
            ) : null;
          })()}
        </div>

        {/* ═══ RECENT ACTIVITY TIMELINE ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#8B5CF6]">history</span>
            Recent Activity
          </h4>
          <div className="space-y-0">
            {[
              { text: 'Water supply issue in Ward 19 marked resolved', time: '10 min ago', icon: 'check_circle', color: '#10B981' },
              { text: 'New SOS alert received from Ward 14', time: '25 min ago', icon: 'emergency', color: '#EF4444' },
              { text: 'PM-KISAN installment processed for 1,240 farmers', time: '1 hour ago', icon: 'agriculture', color: '#FF9933' },
              { text: 'Budget ₹5L approved for Ward 12 drainage', time: '2 hours ago', icon: 'payments', color: '#3B82F6' },
              { text: 'Broadcast: Road closure alert NH-44', time: '4 hours ago', icon: 'campaign', color: '#8B5CF6' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-black/5 dark:border-white/5 last:border-0">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + '15' }}>
                    <span className="material-symbols-outlined text-[12px]" style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  {i < 4 && <div className="w-px flex-1 bg-black/5 dark:bg-white/5 mt-1" />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold leading-snug">{item.text}</p>
                  <p className="text-[9px] text-slate-400 dark:text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
