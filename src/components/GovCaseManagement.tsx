'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const MOCK_CASES = [
  { id: 'GRV-2026-0847', title: 'Broken streetlight — Ward 42', citizen: 'Ramesh Kumar', ward: 'Ward 42', priority: 'critical' as const, status: 'pending' as const, age: '2d', category: 'Infrastructure', dept: 'PWD', slaHours: 12 },
  { id: 'GRV-2026-1293', title: 'Overflowing drain near school', citizen: 'Sunita Devkar', ward: 'Ward 12', priority: 'critical' as const, status: 'pending' as const, age: '4h', category: 'Sanitation', dept: 'Municipal', slaHours: 4 },
  { id: 'GRV-2026-0912', title: 'Ration card renewal stuck', citizen: 'Priya Lakshmi', ward: 'Ward 7', priority: 'medium' as const, status: 'in_progress' as const, age: '5d', category: 'PDS', dept: 'Supply', slaHours: 48 },
  { id: 'GRV-2026-0734', title: 'Water supply irregular 6 AM–10 AM', citizen: 'Mohan Singh', ward: 'Ward 19', priority: 'high' as const, status: 'pending' as const, age: '7d', category: 'Water', dept: 'Jal Board', slaHours: 24 },
  { id: 'GRV-2026-1445', title: 'Stray animal menace near school', citizen: 'Kavita Yadav', ward: 'Ward 31', priority: 'low' as const, status: 'pending' as const, age: '1d', category: 'Municipal', dept: 'Municipal', slaHours: 72 },
  { id: 'GRV-2026-1502', title: 'Pothole on main highway NH-44', citizen: 'Raj Patel', ward: 'Ward 5', priority: 'high' as const, status: 'in_progress' as const, age: '3d', category: 'Infrastructure', dept: 'PWD', slaHours: 36 },
  { id: 'GRV-2026-1589', title: 'Garbage not collected for 4 days', citizen: 'Asha Devi', ward: 'Ward 22', priority: 'medium' as const, status: 'pending' as const, age: '4d', category: 'Sanitation', dept: 'Municipal', slaHours: 24 },
  { id: 'GRV-2026-1601', title: 'Illegal construction in residential zone', citizen: 'Vikram Tiwari', ward: 'Ward 8', priority: 'high' as const, status: 'escalated' as const, age: '10d', category: 'Planning', dept: 'Town Planning', slaHours: 120 },
];

const PRIORITY_META = {
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'CRITICAL', dot: 'bg-red-500' },
  high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'HIGH', dot: 'bg-orange-400' },
  medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'MEDIUM', dot: 'bg-amber-400' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'LOW', dot: 'bg-blue-400' },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  in_progress: { label: 'In Progress', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  resolved: { label: 'Resolved', color: 'text-green-500', bg: 'bg-green-500/10' },
  escalated: { label: 'Escalated', color: 'text-red-500', bg: 'bg-red-500/10' },
};

const DEPARTMENTS = ['All', 'PWD', 'Municipal', 'Jal Board', 'Supply', 'Town Planning'];
const WARDS = ['All Wards', ...[5,7,8,12,19,22,31,42].map(w => `Ward ${w}`)];

export default function GovCaseManagement() {
  const { t } = useTranslation();
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDept, setFilterDept] = useState('All');
  const [filterWard, setFilterWard] = useState('All Wards');
  const [sortBy, setSortBy] = useState<'priority' | 'age' | 'sla'>('priority');
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [caseStatusUpdates, setCaseStatusUpdates] = useState<Record<string, string>>({});

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  const filtered = MOCK_CASES
    .filter(c => filterPriority === 'all' || c.priority === filterPriority)
    .filter(c => filterStatus === 'all' || (caseStatusUpdates[c.id] || c.status) === filterStatus)
    .filter(c => filterDept === 'All' || c.dept === filterDept)
    .filter(c => filterWard === 'All Wards' || c.ward === filterWard)
    .sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'sla') return a.slaHours - b.slaHours;
      return 0; // age — already ordered
    });

  const toggleSelect = (id: string) => {
    setSelectedCases(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const bulkAction = (action: string) => {
    if (action === 'resolve') {
      selectedCases.forEach(id => setCaseStatusUpdates(prev => ({ ...prev, [id]: 'resolved' })));
    } else if (action === 'escalate') {
      selectedCases.forEach(id => setCaseStatusUpdates(prev => ({ ...prev, [id]: 'escalated' })));
    }
    setSelectedCases(new Set());
  };

  const deptCounts = DEPARTMENTS.filter(d => d !== 'All').map(d => ({
    dept: d,
    count: MOCK_CASES.filter(c => c.dept === d).length,
    color: d === 'PWD' ? '#3B82F6' : d === 'Municipal' ? '#F59E0B' : d === 'Jal Board' ? '#06B6D4' : d === 'Supply' ? '#8B5CF6' : '#EF4444',
  }));

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white overflow-y-auto pb-6 no-scrollbar">
      <div className="p-4 space-y-3">
        {/* Header stats */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider">{t('caseManagement', 'Case Management')}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{MOCK_CASES.filter(c => c.priority === 'critical').length} {t('critical', 'Critical')}</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">{MOCK_CASES.length} {t('total', 'Total')}</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-3 shadow-sm dark:shadow-none">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-gray-300 focus:outline-none focus:border-[#138808]/50">
              <option value="all">{t('allPriority', 'All Priority')}</option>
              <option value="critical">🔴 {t('critical', 'Critical')}</option>
              <option value="high">🟠 {t('high', 'High')}</option>
              <option value="medium">🟡 {t('medium', 'Medium')}</option>
              <option value="low">🔵 {t('low', 'Low')}</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-gray-300 focus:outline-none focus:border-[#138808]/50">
              <option value="all">{t('allStatus', 'All Status')}</option>
              <option value="pending">{t('pending', 'Pending')}</option>
              <option value="in_progress">{t('inProgress', 'In Progress')}</option>
              <option value="escalated">{t('escalated', 'Escalated')}</option>
              <option value="resolved">{t('resolved', 'Resolved')}</option>
            </select>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-gray-300 focus:outline-none focus:border-[#138808]/50">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterWard} onChange={e => setFilterWard(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-gray-300 focus:outline-none focus:border-[#138808]/50">
              {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {(['priority', 'sla', 'age'] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${sortBy === s ? 'bg-[#138808] text-white' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>
                  {s === 'sla' ? t('slaSort', 'SLA ⏱️') : s === 'priority' ? t('prioritySort', 'Priority ⚡') : t('ageSort', 'Age 📅')}
                </button>
              ))}
            </div>
            <span className="text-[9px] text-slate-400 dark:text-gray-500">{filtered.length} {t('results', 'results')}</span>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedCases.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-[#138808]/10 border border-[#138808]/20 rounded-xl" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <span className="text-[10px] font-bold text-[#138808] flex-1">{selectedCases.size} {t('selected', 'selected')}</span>
            <button onClick={() => bulkAction('resolve')} className="px-3 py-1 rounded-lg bg-green-500 text-white text-[9px] font-bold hover:bg-green-600 transition-colors">✓ {t('resolveAll', 'Resolve All')}</button>
            <button onClick={() => bulkAction('escalate')} className="px-3 py-1 rounded-lg bg-red-500 text-white text-[9px] font-bold hover:bg-red-600 transition-colors">↑ {t('escalate', 'Escalate')}</button>
            <button onClick={() => setSelectedCases(new Set())} className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-[9px] font-bold text-slate-500 dark:text-gray-400">{t('cancel', 'Cancel')}</button>
          </div>
        )}

        {/* Department distribution */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-3 shadow-sm dark:shadow-none">
          <h4 className="text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('departmentLoad', 'Department Load')}</h4>
          <div className="flex gap-1.5">
            {deptCounts.map(d => (
              <div key={d.dept} className="flex-1 text-center">
                <div className="h-12 bg-black/5 dark:bg-white/5 rounded-lg mb-1 relative overflow-hidden flex items-end">
                  <div className="w-full rounded-lg transition-all" style={{ height: `${(d.count / Math.max(...deptCounts.map(x => x.count))) * 100}%`, backgroundColor: d.color + '40' }} />
                </div>
                <span className="text-[8px] font-bold text-slate-500 dark:text-gray-400 block truncate">{d.dept}</span>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Case cards */}
        <div className="space-y-2">
          {filtered.map(c => {
            const pm = PRIORITY_META[c.priority];
            const status = caseStatusUpdates[c.id] || c.status;
            const sm = STATUS_META[status] || STATUS_META.pending;
            const isExpanded = expandedCase === c.id;
            const isSelected = selectedCases.has(c.id);

            return (
              <div key={c.id} className={`bg-white dark:bg-white/[0.03] border rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-all ${isSelected ? 'border-[#138808] ring-1 ring-[#138808]/30' : pm.border}`}>
                <div className="p-3.5">
                  <div className="flex items-start gap-2.5">
                    {/* Checkbox */}
                    <button onClick={() => toggleSelect(c.id)} className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${isSelected ? 'bg-[#138808] border-[#138808]' : 'border-slate-300 dark:border-gray-600'}`}>
                      {isSelected && <span className="text-white text-[10px]">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[8px] font-black ${pm.color} ${pm.bg} px-1.5 py-0.5 rounded tracking-wider`}>{pm.label}</span>
                        <span className={`text-[8px] font-bold ${sm.color} ${sm.bg} px-1.5 py-0.5 rounded`}>{sm.label}</span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-gray-500 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{c.dept}</span>
                        {c.slaHours <= 12 && status === 'pending' && (
                          <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded animate-pulse">SLA ⏱️ {c.slaHours}h</span>
                        )}
                      </div>
                      <h5 className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight">{c.title}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{c.citizen} · {c.ward} · {c.age} ago</p>
                    </div>
                    <button onClick={() => setExpandedCase(isExpanded ? null : c.id)} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0">
                      <span className="material-symbols-outlined text-slate-400 dark:text-gray-500 text-base">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                    </button>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <select value={status} onChange={e => setCaseStatusUpdates(prev => ({ ...prev, [c.id]: e.target.value }))} className="flex-1 bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#138808]/50">
                      <option value="pending">{t('pending', 'Pending')}</option>
                      <option value="in_progress">{t('inProgress', 'In Progress')}</option>
                      <option value="escalated">{t('escalated', 'Escalated')}</option>
                      <option value="resolved">{t('resolved', 'Resolved')}</option>
                    </select>
                    <button className="px-2.5 py-1.5 rounded-lg bg-[#138808]/10 border border-[#138808]/30 text-[10px] font-bold text-[#138808] hover:bg-[#138808]/20 transition-colors">
                      <span className="material-symbols-outlined text-[11px] align-middle mr-0.5">send</span>
                      {t('assign', 'Assign')}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3.5 space-y-2" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-slate-400 dark:text-gray-500">{t('caseId', 'Case ID')}:</span> <span className="font-bold text-slate-900 dark:text-white">{c.id}</span></div>
                      <div><span className="text-slate-400 dark:text-gray-500">{t('category', 'Category')}:</span> <span className="font-bold text-slate-900 dark:text-white">{t(c.category, c.category)}</span></div>
                      <div><span className="text-slate-400 dark:text-gray-500">{t('department', 'Department')}:</span> <span className="font-bold text-slate-900 dark:text-white">{t(c.dept, c.dept)}</span></div>
                      <div><span className="text-slate-400 dark:text-gray-500">{t('sla', 'SLA')}:</span> <span className="font-bold text-slate-900 dark:text-white">{c.slaHours}h {t('deadline', 'deadline')}</span></div>
                    </div>
                    <div className="text-[9px] text-slate-400 dark:text-gray-500">
                      <p className="font-bold mb-1">{t('timeline', 'Timeline')}:</p>
                      <div className="space-y-1 ml-2 border-l-2 border-[#138808]/20 pl-2">
                        <p>📩 {t('filedBy', 'Filed by')} {t(c.citizen, c.citizen)} — {c.age} {t('ago', 'ago')}</p>
                        <p>🔄 {t('autoRoutedTo', 'Auto-routed to')} {t(c.dept, c.dept)}</p>
                        {status === 'in_progress' && <p>👤 {t('assignedToSubInspector', 'Assigned to Sub-Inspector')}</p>}
                        {status === 'escalated' && <p>⚠️ {t('escalatedToDistrictLevel', 'Escalated to District level')}</p>}
                        {status === 'resolved' && <p>✅ {t('resolvedCitizenNotified', 'Resolved & citizen notified')}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
