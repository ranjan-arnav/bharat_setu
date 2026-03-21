'use client';

import { useState } from 'react';
import CivicDigitalTwin from './CivicDigitalTwin';

const SCHEME_DEPLOYMENTS = [
  { name: 'PM-KISAN', beneficiaries: 12340, target: 15000, color: '#FF9933', icon: 'agriculture' },
  { name: 'Ayushman Bharat', beneficiaries: 8920, target: 12000, color: '#138808', icon: 'health_and_safety' },
  { name: 'PM Awas Yojana', beneficiaries: 3210, target: 5000, color: '#3B82F6', icon: 'home' },
  { name: 'Jan Dhan Yojana', beneficiaries: 18700, target: 20000, color: '#8B5CF6', icon: 'account_balance' },
  { name: 'Ujjwala Yojana', beneficiaries: 6500, target: 8000, color: '#EF4444', icon: 'local_fire_department' },
  { name: 'MGNREGA', beneficiaries: 9800, target: 11000, color: '#14B8A6', icon: 'engineering' },
];

const WARD_DATA = [
  { ward: 'Ward 12', complaints: 47, resolved: 38, satisfaction: 4.1, population: 12400 },
  { ward: 'Ward 42', complaints: 35, resolved: 31, satisfaction: 4.5, population: 8900 },
  { ward: 'Ward 7', complaints: 52, resolved: 41, satisfaction: 3.8, population: 15200 },
  { ward: 'Ward 19', complaints: 28, resolved: 25, satisfaction: 4.6, population: 7600 },
  { ward: 'Ward 31', complaints: 41, resolved: 30, satisfaction: 3.5, population: 11800 },
  { ward: 'Ward 5', complaints: 33, resolved: 29, satisfaction: 4.3, population: 9200 },
  { ward: 'Ward 22', complaints: 56, resolved: 42, satisfaction: 3.2, population: 16800 },
  { ward: 'Ward 8', complaints: 22, resolved: 20, satisfaction: 4.7, population: 6400 },
];

const CATEGORY_DATA = [
  { name: 'Infrastructure', count: 124, color: '#3B82F6', icon: 'construction' },
  { name: 'Sanitation', count: 98, color: '#10B981', icon: 'cleaning_services' },
  { name: 'Water Supply', count: 76, color: '#06B6D4', icon: 'water_drop' },
  { name: 'Electricity', count: 54, color: '#F59E0B', icon: 'bolt' },
  { name: 'PDS/Ration', count: 42, color: '#8B5CF6', icon: 'storefront' },
  { name: 'Health', count: 31, color: '#EF4444', icon: 'medical_services' },
];

const MONTHLY_TRENDS = [
  { month: 'Oct', filed: 180, resolved: 145 },
  { month: 'Nov', filed: 210, resolved: 178 },
  { month: 'Dec', filed: 195, resolved: 186 },
  { month: 'Jan', filed: 240, resolved: 201 },
  { month: 'Feb', filed: 220, resolved: 210 },
  { month: 'Mar', filed: 165, resolved: 142 },
];

export default function GovAnalytics() {
  const [analyticsTab, setAnalyticsTab] = useState<'schemes' | 'wards' | 'trends' | 'twin'>('schemes');
  const totalComplaints = CATEGORY_DATA.reduce((s, c) => s + c.count, 0);
  const maxTrend = Math.max(...MONTHLY_TRENDS.flatMap(t => [t.filed, t.resolved]));
  const sortedWards = [...WARD_DATA].sort((a, b) => b.satisfaction - a.satisfaction);

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white overflow-y-auto pb-6 no-scrollbar">
      <div className="p-4 space-y-4">
        {/* Title + sub-nav */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider mb-3">Analytics & Insights</h3>
          <div className="flex gap-1">
            {[
              { id: 'schemes' as const, label: 'Schemes', icon: 'policy' },
              { id: 'wards' as const, label: 'Wards', icon: 'map' },
              { id: 'trends' as const, label: 'Trends', icon: 'trending_up' },
              { id: 'twin' as const, label: 'AI Twin', icon: 'psychology' },
            ].map(t => (
              <button key={t.id} onClick={() => setAnalyticsTab(t.id)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${analyticsTab === t.id ? 'bg-[#138808] text-white' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>
                <span className="material-symbols-outlined text-sm">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ SCHEMES VIEW ═══ */}
        {analyticsTab === 'schemes' && (
          <>
            {/* Citizen Satisfaction Index */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#8B5CF6]">sentiment_satisfied</span>
                Citizen Satisfaction Index
              </h4>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-black text-green-600 dark:text-green-400">4.2</p>
                  <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold">/ 5.0</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { label: 'Response Time', score: 78, color: '#3B82F6' },
                    { label: 'Resolution Quality', score: 85, color: '#10B981' },
                    { label: 'Communication', score: 72, color: '#F59E0B' },
                    { label: 'Transparency', score: 88, color: '#8B5CF6' },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[9px] text-slate-500 dark:text-gray-400">{m.label}</span>
                        <span className="text-[9px] font-bold text-slate-900 dark:text-white">{m.score}%</span>
                      </div>
                      <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.score}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheme deployment */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#FF9933]">policy</span>
                Scheme Deployment Progress
              </h4>
              <div className="space-y-3">
                {SCHEME_DEPLOYMENTS.map((s, i) => {
                  const pct = Math.round((s.beneficiaries / s.target) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + '20' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: s.color }}>{s.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[11px] font-bold truncate">{s.name}</span>
                          <span className="text-[10px] font-black shrink-0" style={{ color: s.color }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                        </div>
                        <p className="text-[8px] text-slate-400 dark:text-gray-500 mt-0.5">{s.beneficiaries.toLocaleString()} / {s.target.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Population coverage */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#3B82F6]">groups</span>
                Population Coverage
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Total Pop.', value: '88,300', icon: 'people', color: '#3B82F6' },
                  { label: 'App Users', value: '24,150', icon: 'phone_android', color: '#10B981' },
                  { label: 'Coverage', value: '27.3%', icon: 'pie_chart', color: '#FF9933' },
                ].map((m, i) => (
                  <div key={i} className="text-center p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                    <span className="material-symbols-outlined text-base mb-1" style={{ color: m.color }}>{m.icon}</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{m.value}</p>
                    <p className="text-[8px] text-slate-400 dark:text-gray-500">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══ WARDS VIEW ═══ */}
        {analyticsTab === 'wards' && (
          <>
            {/* Category breakdown */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3">Category Breakdown</h4>
              <div className="space-y-2">
                {CATEGORY_DATA.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + '15' }}>
                      <span className="material-symbols-outlined text-[14px]" style={{ color: cat.color }}>{cat.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[10px] font-bold">{cat.name}</span>
                        <span className="text-[10px] font-black" style={{ color: cat.color }}>{cat.count}</span>
                      </div>
                      <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(cat.count / totalComplaints) * 100}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ward comparison table */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3">Ward Comparison</h4>
              <div className="space-y-1.5">
                <div className="flex items-center text-[8px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider px-1">
                  <span className="flex-1">Ward</span>
                  <span className="w-12 text-center">Filed</span>
                  <span className="w-12 text-center">Solved</span>
                  <span className="w-10 text-center">Rate</span>
                  <span className="w-10 text-center">Score</span>
                </div>
                {sortedWards.map((w, i) => {
                  const rate = Math.round((w.resolved / w.complaints) * 100);
                  return (
                    <div key={i} className={`flex items-center px-2 py-2 rounded-lg text-[10px] ${i < 3 ? 'bg-green-500/5 dark:bg-green-500/5' : i >= sortedWards.length - 2 ? 'bg-red-500/5 dark:bg-red-500/5' : 'bg-black/[0.01] dark:bg-white/[0.01]'}`}>
                      <span className="flex-1 font-bold flex items-center gap-1">
                        {i === 0 && '🥇'}{i === 1 && '🥈'}{i === 2 && '🥉'}
                        {w.ward}
                      </span>
                      <span className="w-12 text-center text-slate-600 dark:text-gray-300">{w.complaints}</span>
                      <span className="w-12 text-center text-green-600 dark:text-green-400 font-bold">{w.resolved}</span>
                      <span className="w-10 text-center font-bold" style={{ color: rate >= 85 ? '#10B981' : rate >= 70 ? '#F59E0B' : '#EF4444' }}>{rate}%</span>
                      <span className="w-10 text-center font-black" style={{ color: w.satisfaction >= 4.3 ? '#10B981' : w.satisfaction >= 3.5 ? '#F59E0B' : '#EF4444' }}>{w.satisfaction}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ═══ TRENDS VIEW ═══ */}
        {analyticsTab === 'trends' && (
          <>
            {/* Monthly trend chart */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3">Complaints vs Resolutions (6 months)</h4>
              <div className="flex items-end gap-2 h-36">
                {MONTHLY_TRENDS.map((t, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
                      <div className="flex-1 rounded-t-md bg-red-400/30 dark:bg-red-400/20 transition-all duration-700" style={{ height: `${(t.filed / maxTrend) * 100}%` }} />
                      <div className="flex-1 rounded-t-md bg-green-400/50 dark:bg-green-400/30 transition-all duration-700" style={{ height: `${(t.resolved / maxTrend) * 100}%` }} />
                    </div>
                    <span className="text-[8px] text-slate-400 dark:text-gray-500 font-bold">{t.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-gray-400"><span className="w-2 h-2 rounded-sm bg-red-400/40" /> Filed</span>
                <span className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-gray-400"><span className="w-2 h-2 rounded-sm bg-green-400/60" /> Resolved</span>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Avg Resolution Time', value: '3.2 days', icon: 'schedule', color: '#3B82F6', trend: '↓ 18% vs last quarter' },
                { label: 'Citizen Reach', value: '27.3%', icon: 'cell_tower', color: '#10B981', trend: '↑ 4.1% this month' },
                { label: 'SLA Compliance', value: '91.4%', icon: 'task_alt', color: '#FF9933', trend: '↑ 2.3% improvement' },
                { label: 'Repeat Complaints', value: '8.7%', icon: 'replay', color: '#EF4444', trend: '↓ 1.2% reduction' },
              ].map((m, i) => (
                <div key={i} className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-3.5 shadow-sm dark:shadow-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 rounded-full blur-2xl opacity-15" style={{ backgroundColor: m.color }} />
                  <span className="material-symbols-outlined text-[16px] mb-1" style={{ color: m.color }}>{m.icon}</span>
                  <p className="text-lg font-black">{m.value}</p>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold">{m.label}</p>
                  <p className="text-[8px] text-slate-400 dark:text-gray-500 mt-1">{m.trend}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══ DIGITAL TWIN VIEW ═══ */}
        {analyticsTab === 'twin' && <CivicDigitalTwin />}
      </div>
    </div>
  );
}
