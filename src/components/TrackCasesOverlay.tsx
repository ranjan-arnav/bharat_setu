'use client';

import { useState } from 'react';
import { useAppStore, type TrackedItem, type AgentKey } from '@/lib/store';
import { hasPermission } from '@/lib/permissions';
import { FlagStripe } from '@/components/ui/GoiElements';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { calculateTrustScore } from '@/lib/intelligence';

const STATUS_META: Record<TrackedItem['status'], { label: string; color: string; bg: string; border: string; dot: string }> = {
  'Active':       { label: 'Active',        color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   dot: 'bg-blue-400' },
  'Under Review': { label: 'Under Review',  color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  dot: 'bg-amber-400 animate-pulse' },
  'In Progress':  { label: 'In Progress',   color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', dot: 'bg-orange-400 animate-pulse' },
  'Resolved':     { label: 'Resolved ✓',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/25',  dot: 'bg-green-400' },
  'Pending':      { label: 'Pending',       color: 'text-slate-500 dark:text-gray-400',   bg: 'bg-black/5 dark:bg-white/5',       border: 'border-black/10 dark:border-white/10',      dot: 'bg-gray-500' },
};

const TYPE_ICON: Record<TrackedItem['type'], { icon: string; color: string; bg: string }> = {
  grievance: { icon: 'report_problem', color: '#3B82F6', bg: '#3B82F610' },
  scheme:    { icon: 'volunteer_activism', color: '#F59E0B', bg: '#F59E0B10' },
  health:    { icon: 'health_and_safety', color: '#10B981', bg: '#10B98110' },
  legal:     { icon: 'gavel',             color: '#EF4444', bg: '#EF444410' },
  finance:   { icon: 'account_balance_wallet', color: '#8B5CF6', bg: '#8B5CF610' },
};

const AGENT_NAMES: Record<AgentKey, string> = {
  nagarik_mitra:    'Nagarik Mitra',
  swasthya_sahayak: 'Swasthya Sahayak',
  yojana_saathi:    'Yojana Saathi',
  arthik_salahkar:  'Arthik Salahkar',
  vidhi_sahayak:    'Vidhi Sahayak',
  kisan_mitra:      'Kisan Mitra',
};

function timeAgo(ts: number, t: (key: string, fallback?: string) => string): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return t('Just now');
  if (diff < 3600000) return `${Math.floor(diff / 60000)}${t('m ago')}`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}${t('h ago')}`;
  return `${Math.floor(diff / 86400000)}${t('d ago')}`;
}

interface Props {
  onClose: () => void;
  onOpenGrievance: () => void;
  onOpenAgent: (agent: AgentKey) => void;
}

export default function TrackCasesOverlay({ onClose, onOpenGrievance, onOpenAgent }: Props) {
  const { trackedItems, updateTrackedStatus, setActiveAgent, role } = useAppStore();
  const canUpdateStatus = hasPermission(role, 'update_status');
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TrackedItem['type'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const FILTERS: { key: TrackedItem['type'] | 'all'; label: string; icon: string }[] = [
    { key: 'all',       label: t('filterAll'),     icon: 'list_alt' },
    { key: 'grievance', label: t('filterCivic'),   icon: 'report_problem' },
    { key: 'scheme',    label: t('filterSchemes'), icon: 'volunteer_activism' },
    { key: 'health',    label: t('filterHealth'),  icon: 'health_and_safety' },
    { key: 'legal',     label: t('filterLegal'),   icon: 'gavel' },
    { key: 'finance',   label: t('filterFinance'), icon: 'account_balance_wallet' },
  ];

  const filtered = filter === 'all' ? trackedItems : trackedItems.filter((item) => item.type === filter);
  const resolvedCount = trackedItems.filter((item) => item.status === 'Resolved').length;
  const activeCount   = trackedItems.filter((item) => item.status !== 'Resolved').length;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#0a1628] flex flex-col max-w-[430px] mx-auto"
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      <FlagStripe />
      {/* Header */}
      <div className="px-4 py-3 bg-white/95 dark:bg-[#0f1f3a]/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onClose} className="p-1">
            <span className="material-symbols-outlined text-slate-500 dark:text-gray-400">arrow_back</span>
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF9933] text-base">assignment</span>
              {t('myCasesTracking')}
            </h2>
            <div className="text-[10px] text-slate-500 dark:text-gray-400">{activeCount} {t('activeCases')} · {resolvedCount} {t('resolvedCases')}</div>
          </div>
          <button
            onClick={onOpenGrievance}
            className="flex items-center gap-1 bg-[#FF9933]/15 border border-[#FF9933]/30 rounded-full px-3 py-1.5 text-xs font-bold text-[#FF9933] hover:bg-[#FF9933]/25 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            {t('newItem')}
          </button>
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2 text-center">
            <div className="text-lg font-black text-orange-400">{activeCount}</div>
            <div className="text-[9px] text-slate-500 dark:text-gray-400 uppercase tracking-wide">{t('activeCases')}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 text-center">
            <div className="text-lg font-black text-green-400">{resolvedCount}</div>
            <div className="text-[9px] text-slate-500 dark:text-gray-400 uppercase tracking-wide">{t('resolvedCases')}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 text-center">
            <div className="text-lg font-black text-blue-400">{trackedItems.length}</div>
            <div className="text-[9px] text-slate-500 dark:text-gray-400 uppercase tracking-wide">{t('totalCases')}</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? trackedItems.length : trackedItems.filter((item) => item.type === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  filter === f.key
                    ? 'bg-[#FF9933] text-slate-900 dark:text-white'
                    : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-black/10 dark:border-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[11px]">{f.icon}</span>
                {f.label}
                {count > 0 && (
                  <span className={`ml-0.5 text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center ${filter === f.key ? 'bg-white/30 text-slate-900 dark:text-white' : 'bg-black/10 dark:bg-white/10 text-slate-600 dark:text-gray-300'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cases list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-500 text-3xl">inbox</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 dark:text-gray-300">{t('noCasesYet')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('fileGrievancePrompt')}</p>
            </div>
            <button
              onClick={onOpenGrievance}
              className="bg-[#FF9933]/15 border border-[#FF9933]/30 rounded-xl px-4 py-2 text-sm font-bold text-[#FF9933]"
            >
              {t('fileGrievanceBtn')}
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const sm = STATUS_META[item.status];
            const tm = TYPE_ICON[item.type];
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border overflow-hidden transition-all ${sm.bg} ${sm.border}`}
              >
                {/* Card header — always visible */}
                <button
                  className="w-full px-4 py-3.5 flex items-start gap-3 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Type icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: tm.bg }}
                  >
                    {item.emoji ? (
                      <span className="text-xl">{item.emoji}</span>
                    ) : (
                      <span className="material-symbols-outlined text-base" style={{ color: tm.color }}>
                        {tm.icon}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${sm.color} ${sm.bg} ${sm.border} flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`}></span>
                        {t(sm.label, sm.label)}
                      </span>
                      <span className="text-[9px] text-gray-500">{timeAgo(item.createdAt, t)}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{item.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">{item.description}</p>
                  </div>

                  <span className="material-symbols-outlined text-gray-500 text-lg shrink-0 mt-1 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                  </span>
                </button>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-2">
                      {item.refId && (
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wide">{t('Ref ID')}</div>
                          <div className="text-[11px] font-mono font-bold text-slate-900 dark:text-white mt-0.5">{item.refId}</div>
                        </div>
                      )}
                      {item.amount && (
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wide">{t('Amount')}</div>
                          <div className="text-[11px] font-bold text-green-400 mt-0.5">{item.amount}</div>
                        </div>
                      )}
                      {item.eta && (
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wide">{t('ETA')}</div>
                          <div className="text-[11px] font-bold text-slate-900 dark:text-white mt-0.5">{item.eta}</div>
                        </div>
                      )}
                      {item.neighbourhood && (
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2">
                          <div className="text-[9px] text-gray-500 uppercase tracking-wide">{t('Neighbours')}</div>
                          <div className="text-[11px] font-bold text-amber-400 mt-0.5">+{item.neighbourhood} {t('same issue')}</div>
                        </div>
                      )}
                    </div>

                    {/* Trust Score Badge */}
                    {(() => {
                      const deptMap: Record<string, string> = { grievance: 'Municipal', scheme: 'Revenue', health: 'Health', legal: 'Police', finance: 'Revenue' };
                      const dept = deptMap[item.type] || 'Municipal';
                      const ts = calculateTrustScore(dept);
                      return (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5">
                          <span className="material-symbols-outlined text-sm" style={{ color: ts.color }}>verified</span>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white">{t(dept, dept)} {t('Dept Trust Score: ')}</span>
                            <span className="text-[11px] font-black" style={{ color: ts.color }}>{ts.score}/10</span>
                            <span className="text-[8px] font-bold ml-1 px-1 py-0.5 rounded" style={{ color: ts.color, backgroundColor: ts.color + '15' }}>{t(ts.label, ts.label)}</span>
                          </div>
                          <span className={`material-symbols-outlined text-xs ${ts.trend === 'up' ? 'text-green-500' : ts.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                            {ts.trend === 'up' ? 'trending_up' : ts.trend === 'down' ? 'trending_down' : 'trending_flat'}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Agent tag + portal */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 rounded-full px-2 py-1">
                        <span className="material-symbols-outlined text-[10px] text-slate-500 dark:text-gray-400">smart_toy</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">{t(AGENT_NAMES[item.agentKey], AGENT_NAMES[item.agentKey])}</span>
                      </div>
                      {item.portal && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400">
                          <span className="material-symbols-outlined text-[10px]">link</span>
                          <span>{item.portal}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {item.status !== 'Resolved' && (
                        <button
                          onClick={() => updateTrackedStatus(item.id, 'Resolved')}
                          className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-all active:scale-95"
                        >
                          {t('✓ Mark Resolved')}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveAgent(item.agentKey);
                          onOpenAgent(item.agentKey);
                        }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/25 hover:bg-[#FF9933]/25 transition-all active:scale-95"
                      >
                        {t('💬 Ask Agent')}
                      </button>
                    </div>

                    {/* Government-only: Status Update Dropdown */}
                    {canUpdateStatus && item.status !== 'Resolved' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#138808]/10 border border-[#138808]/20">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="material-symbols-outlined text-[12px] text-[#138808]">admin_panel_settings</span>
                          <span className="text-[9px] font-bold text-[#138808] uppercase tracking-wider">{t('Government Action')}</span>
                        </div>
                        <select
                          value={item.status}
                          onChange={(e) => updateTrackedStatus(item.id, e.target.value as TrackedItem['status'])}
                          className="w-full bg-white dark:bg-black/30 border border-[#138808]/30 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138808]"
                        >
                          <option value="Pending">{t('Pending')}</option>
                          <option value="Under Review">{t('Under Review')}</option>
                          <option value="In Progress">{t('In Progress')}</option>
                          <option value="Resolved">{t('Resolved')}</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* New Grievance CTA at bottom */}
        {filtered.length > 0 && (
          <button
            onClick={() => {
              console.log('Opening grievance form from track overlay');
              onOpenGrievance();
            }}
            className="w-full py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/15 text-sm text-slate-500 dark:text-gray-400 flex items-center justify-center gap-2 hover:bg-white/8 transition-all"
          >
            <span className="material-symbols-outlined text-gray-500">add_circle_outline</span>
            {t('fileGrievanceBtn')}
          </button>
        )}
      </div>
    </div>
  );
}
