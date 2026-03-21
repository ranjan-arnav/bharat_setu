'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

const OFFICERS = [
  { name: 'Dr. Anita Sharma', role: 'District Magistrate', dept: 'Administration', status: 'active' as const, avatar: 'AS', casesHandled: 245, rating: 4.8 },
  { name: 'Raj Verma', role: 'Sub-Divisional Officer', dept: 'Revenue', status: 'active' as const, avatar: 'RV', casesHandled: 189, rating: 4.5 },
  { name: 'Priya Gupta', role: 'Block Dev. Officer', dept: 'Rural Dev.', status: 'on_leave' as const, avatar: 'PG', casesHandled: 156, rating: 4.3 },
  { name: 'Amit Singh', role: 'Executive Engineer', dept: 'PWD', status: 'active' as const, avatar: 'AS', casesHandled: 312, rating: 4.6 },
  { name: 'Neha Tiwari', role: 'Health Officer', dept: 'Health', status: 'field' as const, avatar: 'NT', casesHandled: 98, rating: 4.9 },
  { name: 'Vikrant Yadav', role: 'Tax Inspector', dept: 'Revenue', status: 'active' as const, avatar: 'VY', casesHandled: 72, rating: 4.1 },
];

const DEPARTMENTS_OVERVIEW = [
  { name: 'PWD', head: 'Amit Singh', activeCase: 42, resolved: 186, budget: '₹45L', color: '#3B82F6' },
  { name: 'Municipal Corp', head: 'Rekha Iyer', activeCase: 38, resolved: 201, budget: '₹28L', color: '#F59E0B' },
  { name: 'Jal Board', head: 'Suresh Rao', activeCase: 22, resolved: 134, budget: '₹35L', color: '#06B6D4' },
  { name: 'Health Dept', head: 'Dr. Neha Tiwari', activeCase: 15, resolved: 89, budget: '₹52L', color: '#10B981' },
  { name: 'Revenue', head: 'Raj Verma', activeCase: 28, resolved: 167, budget: '₹18L', color: '#8B5CF6' },
  { name: 'Town Planning', head: 'Deepak Mehra', activeCase: 11, resolved: 45, budget: '₹22L', color: '#EF4444' },
];

const AUDIT_LOG = [
  { action: 'Case GRV-2026-1293 escalated to District level', officer: 'Dr. Anita Sharma', time: '15 min ago', type: 'escalation' },
  { action: 'Budget ₹5L approved for Ward 12 drainage project', officer: 'Raj Verma', time: '1 hour ago', type: 'approval' },
  { action: 'Emergency protocol FLOOD deactivated', officer: 'System', time: '3 hours ago', type: 'system' },
  { action: 'Broadcast sent: Water supply disruption notice', officer: 'Amit Singh', time: '4 hours ago', type: 'broadcast' },
  { action: 'Officer Priya Gupta marked on leave', officer: 'System', time: '8 hours ago', type: 'system' },
  { action: '12 cases bulk-resolved in Sanitation dept', officer: 'Rekha Iyer', time: '1 day ago', type: 'resolution' },
  { action: 'New scheme PM Modi Awas registered', officer: 'System', time: '2 days ago', type: 'system' },
  { action: 'SOS response dispatched to Ward 14', officer: 'Control Room', time: '2 days ago', type: 'emergency' },
];

export default function GovAdmin() {
  const { citizenProfile, logout } = useAppStore();
  const [adminTab, setAdminTab] = useState<'officers' | 'departments' | 'audit' | 'settings'>('officers');
  const [notifPrefs, setNotifPrefs] = useState({ sos: true, cases: true, schemes: false, broadcast: true });

  const statusMeta = {
    active: { label: 'Active', color: 'text-green-500', bg: 'bg-green-500/10', dot: 'bg-green-500' },
    on_leave: { label: 'Leave', color: 'text-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
    field: { label: 'Field', color: 'text-blue-500', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  };

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white overflow-y-auto pb-6 no-scrollbar">
      <div className="p-4 space-y-4">
        {/* Officer profile card */}
        <div className="bg-gradient-to-br from-[#138808]/10 to-[#138808]/5 border border-[#138808]/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#138808] flex items-center justify-center text-white text-lg font-black shadow-lg">DM</div>
            <div className="flex-1">
              <h3 className="text-base font-black">{citizenProfile?.name || 'District Magistrate'}</h3>
              <p className="text-[10px] text-[#138808] font-bold uppercase tracking-widest">Government Admin · {citizenProfile?.district || 'Lucknow'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-[#138808]/10 text-[#138808] px-2 py-0.5 rounded-full font-bold">IAS Cadre</span>
                <span className="text-[9px] bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">Since 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1">
          {[
            { id: 'officers' as const, label: 'Officers', icon: 'badge' },
            { id: 'departments' as const, label: 'Depts', icon: 'corporate_fare' },
            { id: 'audit' as const, label: 'Audit', icon: 'history' },
            { id: 'settings' as const, label: 'Settings', icon: 'settings' },
          ].map(t => (
            <button key={t.id} onClick={() => setAdminTab(t.id)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${adminTab === t.id ? 'bg-[#138808] text-white' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══ OFFICERS TAB ═══ */}
        {adminTab === 'officers' && (
          <div className="space-y-2">
            {OFFICERS.map((o, i) => {
              const s = statusMeta[o.status];
              return (
                <div key={i} className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-3.5 shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#138808]/20 to-[#138808]/10 flex items-center justify-center text-[#138808] font-black text-sm">{o.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-bold truncate">{o.name}</p>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      </div>
                      <p className="text-[9px] text-slate-500 dark:text-gray-400">{o.role} · {o.dept}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black text-[#138808]">⭐ {o.rating}</p>
                      <p className="text-[8px] text-slate-400 dark:text-gray-500">{o.casesHandled} cases</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ DEPARTMENTS TAB ═══ */}
        {adminTab === 'departments' && (
          <div className="space-y-2.5">
            {DEPARTMENTS_OVERVIEW.map((d, i) => (
              <div key={i} className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-[13px] font-bold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </h5>
                    <p className="text-[9px] text-slate-500 dark:text-gray-400">Head: {d.head}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">{d.budget}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-orange-500/5 rounded-lg p-2 text-center">
                    <p className="text-lg font-black text-orange-500">{d.activeCase}</p>
                    <p className="text-[8px] text-slate-400 dark:text-gray-500">Active</p>
                  </div>
                  <div className="bg-green-500/5 rounded-lg p-2 text-center">
                    <p className="text-lg font-black text-green-500">{d.resolved}</p>
                    <p className="text-[8px] text-slate-400 dark:text-gray-500">Resolved</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ AUDIT TAB ═══ */}
        {adminTab === 'audit' && (
          <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
            <div className="space-y-0">
              {AUDIT_LOG.map((log, i) => {
                const typeIcon = {
                  escalation: { icon: 'arrow_upward', color: '#EF4444' },
                  approval: { icon: 'check_circle', color: '#10B981' },
                  system: { icon: 'settings', color: '#6B7280' },
                  broadcast: { icon: 'campaign', color: '#3B82F6' },
                  resolution: { icon: 'task_alt', color: '#138808' },
                  emergency: { icon: 'emergency', color: '#EF4444' },
                }[log.type] || { icon: 'info', color: '#6B7280' };

                return (
                  <div key={i} className="flex gap-3 py-3 border-b border-black/5 dark:border-white/5 last:border-0">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: typeIcon.color + '15' }}>
                        <span className="material-symbols-outlined text-[14px]" style={{ color: typeIcon.color }}>{typeIcon.icon}</span>
                      </div>
                      {i < AUDIT_LOG.length - 1 && <div className="w-px flex-1 bg-black/5 dark:bg-white/5 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold leading-snug">{log.action}</p>
                      <p className="text-[9px] text-slate-400 dark:text-gray-500 mt-0.5">{log.officer} · {log.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {adminTab === 'settings' && (
          <>
            {/* Notification prefs */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3">Notification Preferences</h4>
              {[
                { key: 'sos' as const, label: 'SOS Alerts', desc: 'Receive distress signal notifications', icon: 'sos', color: '#EF4444' },
                { key: 'cases' as const, label: 'Case Updates', desc: 'New complaints & status changes', icon: 'assignment', color: '#3B82F6' },
                { key: 'schemes' as const, label: 'Scheme Updates', desc: 'Beneficiary milestones', icon: 'policy', color: '#FF9933' },
                { key: 'broadcast' as const, label: 'Broadcast Receipts', desc: 'Delivery confirmations', icon: 'campaign', color: '#138808' },
              ].map(n => (
                <div key={n.key} className="flex items-center gap-3 py-2.5 border-b border-black/5 dark:border-white/5 last:border-0">
                  <span className="material-symbols-outlined text-lg" style={{ color: n.color }}>{n.icon}</span>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold">{n.label}</p>
                    <p className="text-[9px] text-slate-400 dark:text-gray-500">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${notifPrefs[n.key] ? 'bg-[#138808]' : 'bg-slate-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${notifPrefs[n.key] ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Data export */}
            <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3">Data Export</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Cases Report', icon: 'assignment', format: 'CSV' },
                  { label: 'Scheme Data', icon: 'policy', format: 'Excel' },
                  { label: 'SOS History', icon: 'sos', format: 'PDF' },
                  { label: 'Audit Trail', icon: 'history', format: 'CSV' },
                ].map((ex, i) => (
                  <button key={i} className="flex items-center gap-2 p-3 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <span className="material-symbols-outlined text-[16px] text-[#138808]">{ex.icon}</span>
                    <div className="text-left">
                      <p className="text-[10px] font-bold">{ex.label}</p>
                      <p className="text-[8px] text-slate-400 dark:text-gray-500">{ex.format}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button onClick={logout} className="w-full py-3 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout from Admin Panel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
