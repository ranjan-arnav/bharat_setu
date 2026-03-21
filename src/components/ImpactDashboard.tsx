'use client';

import { useState } from 'react';
import { IMPACT_DATA } from '@/lib/demo-data';
import { useAppStore, getUserLevelDescriptor } from '@/lib/store';
import { hasPermission } from '@/lib/permissions';
import NagarPulse from './NagarPulse';
import { FlagStripe } from '@/components/ui/GoiElements';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAllClusters, getAllTrustScores } from '@/lib/intelligence';

// Simple chart components (to avoid recharts SSR issues)
function BarChart({ data, max }: { data: { label: string; value: number; color: string }[]; max: number }) {
  const safeMax = Math.max(1, max);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-slate-900 dark:text-white">{d.value}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{
              height: `${(d.value / safeMax) * 100}%`,
              background: d.color,
              animation: `slideUp 0.5s ease-out ${i * 0.1}s both`,
              minHeight: '4px',
            }}
          />
          <span className="text-[9px] text-slate-500 dark:text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = Math.max(1, data.reduce((sum, d) => sum + d.value, 0));
  let cumulative = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {data.map((d, i) => {
            const pct = (d.value / total) * 100;
            const offset = cumulative;
            cumulative += pct;
            return (
              <circle
                key={i}
                cx="18" cy="18" r="14"
                fill="none"
                stroke={d.color}
                strokeWidth="4"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={-offset}
                className="transition-all duration-1000"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-slate-900 dark:text-white">{total}</span>
          <span className="text-[8px] text-slate-500 dark:text-gray-400">TOTAL</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-slate-600 dark:text-gray-300">{d.label}</span>
            <span className="font-bold text-slate-900 dark:text-white ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_NEWS = [
  { id: 1, title: 'Road Repair Project Approved', description: 'Municipal corporation has finally approved ₹45L for patching Sector 12 internal roads taking action on 12 community complaints.', location: 'Sector 12', time: '2 hours ago', tag: 'Civic Action', alert: false },
  { id: 2, title: 'PM-Svanidhi Loan Camp Tomorrow', description: 'Street vendors can register for ₹10k micro-loans instantly at the District Magistrate office. Bring Aadhaar.', location: 'DM Office', time: '5 hours ago', tag: 'Scheme Alert', alert: true },
  { id: 3, title: 'Dengue Prevention Drive', description: 'Health workers will pass through Ward 4 to spray targeted zones today. Keep windows closed during 4-5 PM.', location: 'Ward 4', time: '1 day ago', tag: 'Health', alert: false },
];

export default function ImpactDashboard({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'overview' | 'trends' | 'agents' | 'trust' | 'pulse' | 'collective'>('overview');
  const { weeklyTrend, agentUsage, topGrievances, schemeSaturation } = IMPACT_DATA;

  // Real user data from store — blended with platform-wide IMPACT_DATA base
  const { trackedItems, karmaScore, role, collectiveClusters, addCluster, addKarma } = useAppStore();
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const myResolved = trackedItems.filter(i => i.status === 'Resolved').length;
  const mySchemes = trackedItems.filter(i => i.type === 'scheme').length;
  const myGrievances = trackedItems.filter(i => i.type === 'grievance').length;
  const level = getUserLevelDescriptor(karmaScore);
  const canBroadcast = hasPermission(role, 'broadcast');
  const canJoinCollective = hasPermission(role, 'community_engage');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Platform total = base demo + current user's real contributions
  const totalGrievancesResolved = IMPACT_DATA.overview.grievancesResolved + myResolved;
  const totalSchemesMatched = IMPACT_DATA.overview.schemesMatched + mySchemes;

  const statCards = [
    { label: t('grievancesResolved', 'Grievances Resolved'), value: totalGrievancesResolved.toLocaleString(), icon: 'task_alt', color: '#138808' },
    { label: t('schemesMatched', 'Schemes Matched'), value: totalSchemesMatched.toLocaleString(), icon: 'verified', color: '#FF9933' },
    { label: t('citizensServed', 'Citizens Served'), value: IMPACT_DATA.overview.totalUsers.toLocaleString(), icon: 'group', color: '#4299E1' },
    { label: t('myKarmaScore', 'My Karma Score'), value: karmaScore.toLocaleString(), icon: 'military_tech', color: '#9F7AEA' },
    { label: t('myCasesFiled', 'My Cases Filed'), value: myGrievances.toLocaleString(), icon: 'folder_open', color: '#D69E2E' },
    { label: t('avgResolution', 'Avg Resolution'), value: `${IMPACT_DATA.overview.avgResolutionDays}${t('d', 'd')}`, icon: 'speed', color: '#E53E3E' },
  ];

  const tabs = [
    { id: 'overview', label: t('overview', 'Overview'), icon: 'dashboard' },
    { id: 'collective', label: t('collective', 'Collective'), icon: 'group_work' },
    { id: 'trends', label: t('trends', 'Trends'), icon: 'trending_up' },
    { id: 'agents', label: t('agents', 'Agents'), icon: 'smart_toy' },
    { id: 'trust', label: t('trust', 'Trust'), icon: 'verified_user' },
    { id: 'pulse', label: t('pulse', 'Pulse'), icon: 'location_city' }
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#0a1628] flex flex-col max-w-[430px] mx-auto" style={{ animation: 'slideUp 0.3s ease-out' }}>
      <FlagStripe />
      {/* Header */}
      <div className="px-4 py-3 bg-white/95 dark:bg-[#0f1f3a]/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1">
            <span className="material-symbols-outlined text-slate-500 dark:text-gray-400">arrow_back</span>
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {t('communityHub', 'Community Hub')}
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${level.bg} ${level.color}`}>
                {t(level.title, level.title)}
              </span>
            </h2>
            <span className="text-[10px] text-slate-500 dark:text-gray-400">{t('realtimeGovernanceAnalytics', 'Real-time governance analytics')}</span>
          </div>
          <div className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg border border-black/10 dark:border-white/10">
            <span className="text-[9px] text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {t('live', 'LIVE')}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${tab === t.id ? 'bg-[#FF9933] text-slate-900 dark:text-white' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400'
                }`}
            >
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4 no-scrollbar">
        {tab === 'overview' && (
          <>
            {/* Government-only: Broadcast Announcement */}
            {canBroadcast && (
              <div className="bg-[#138808]/10 border border-[#138808]/20 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#138808] text-base">campaign</span>
                  <h4 className="text-[11px] font-black text-[#138808] uppercase tracking-widest">{t('broadcastAnnouncement', 'Broadcast Announcement')}</h4>
                </div>
                {broadcastSent ? (
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {t('announcementSentToAllCitizensInYourJurisdiction', 'Announcement sent to all citizens in your jurisdiction!')}
                  </div>
                ) : (
                  <button
                    onClick={() => setBroadcastSent(true)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#138808] text-white hover:bg-[#0d6b06] transition-all active:scale-[0.98] shadow-md shadow-green-800/20"
                  >
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">send</span>
                    {t('sendPublicAnnouncement', 'Send Public Announcement')}
                  </button>
                )}
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((s, i) => (
                <div
                  key={i}
                  className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-3 flex flex-col gap-1"
                  style={{ animation: `fadeIn 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">{s.label}</span>
                  </div>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Community News Feed */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">public</span>
                  {t('communityNews', 'Community News')}
                </h4>
                <span className="text-[9px] font-bold text-[#FF9933] uppercase tracking-wider flex items-center gap-1">
                  {t('trending', 'Trending')} <span className="material-symbols-outlined text-[12px]">trending_up</span>
                </span>
              </div>
              <div className="space-y-3">
                {MOCK_NEWS.map(news => (
                  <div key={news.id} className="bg-white dark:bg-[#162a4a] border border-black/5 dark:border-white/5 rounded-xl p-3 shadow-sm hover:border-[#FF9933]/50 transition-colors">
                    <div className="flex items-start justify-between mb-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 w-max ${news.alert ? 'bg-red-500/10 text-red-500' : 'bg-[#FF9933]/10 text-[#FF9933]'}`}>
                        {news.alert && <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>}
                        {t(news.tag, news.tag)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">{t(news.time, news.time)}</span>
                    </div>
                    <h5 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight mb-1">{t(news.title, news.title)}</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mb-2">{t(news.description, news.description)}</p>
                    {news.location && (
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-500">
                        <span className="material-symbols-outlined text-[11px]">location_on</span>
                        {t(news.location, news.location)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Grievances */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('topGrievanceCategories', 'Top Grievance Categories')}</h4>
              <div className="space-y-3">
                {topGrievances.map((g, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-900 dark:text-white font-bold">{t(g.category, g.category)}</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">{g.count} {t('reported', 'reported')}</span>
                    </div>
                    <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(g.count / topGrievances[0].count) * 100}%`,
                          background: g.trend === 'down' ? '#138808' : '#FF9933',
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-500">{t('trend', 'Trend:')} {g.trend === 'down' ? t('Decreasing', '↓ Decreasing') : g.trend === 'up' ? t('Increasing', '↑ Increasing') : t('Stable', '→ Stable')}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'trends' && (
          <>
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">{t('weeklyActivityTrend', 'Weekly Activity Trend')}</h4>
              <BarChart
                data={weeklyTrend.map((d) => ({
                  label: t(d.day, d.day),
                  value: d.grievances + d.schemes + d.voice,
                  color: '#FF9933',
                }))}
                max={Math.max(...weeklyTrend.map((d) => d.grievances + d.schemes + d.voice))}
              />
            </div>

            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">{t('schemesMatchedPerDay', 'Schemes Matched Per Day')}</h4>
              <BarChart
                data={weeklyTrend.map((d) => ({
                  label: t(d.day, d.day),
                  value: d.schemes,
                  color: '#138808',
                }))}
                max={Math.max(...weeklyTrend.map((d) => d.schemes))}
              />
            </div>

            {/* Scheme Saturation */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('schemeSaturationIndex', 'Scheme Saturation Index')}</h4>
              <div className="space-y-3">
                {schemeSaturation.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-900 dark:text-white font-bold">{t(s.scheme, s.scheme)}</span>
                      <span className="text-xs font-bold" style={{ color: s.enrolled > 70 ? '#138808' : '#FF9933' }}>
                        {s.enrolled}%
                      </span>
                    </div>
                    <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${s.enrolled}%`,
                          background: `linear-gradient(90deg, #FF9933, ${s.enrolled > 70 ? '#138808' : '#FF9933'})`,

                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'agents' && (
          <>
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">{t('agentUsageDistribution', 'Agent Usage Distribution')}</h4>
              <DonutChart
                data={agentUsage.map((a) => ({
                  label: t(a.name, a.name),
                  value: a.value,
                  color: a.color,
                }))}
              />
            </div>

            {/* Agent Cards */}
            <div className="space-y-3">
              {agentUsage.map((a, i) => {
                const icons = ['diversity_3', 'handshake', 'medical_services', 'currency_rupee', 'gavel'];
                return (
                  <div
                    key={i}
                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-3 flex items-center gap-3"
                    style={{ animation: `fadeIn 0.4s ease-out ${i * 0.1}s both` }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.color + '20' }}>
                      <span className="material-symbols-outlined text-lg" style={{ color: a.color }}>{icons[i] || 'smart_toy'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{t(a.name, a.name)}</h5>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">{a.value}% {t('ofQueries', 'of queries')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white">{a.value}%</span>
                      <span className="block text-[8px] text-gray-500">{t('usage', 'USAGE')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'trust' && (
          <>
            {/* Trust Score */}
            <div className="bg-gradient-to-br from-[#FF9933]/10 to-[#138808]/10 border border-black/10 dark:border-white/10 rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-5xl text-[#FF9933]">verified_user</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">94.2<span className="text-sm text-slate-500 dark:text-gray-400 font-normal">/100</span></h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{t('communityTrustScore', 'Community Trust Score')}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="text-[10px] text-green-400 font-bold">↑ 12.5%</span>
                <span className="text-[10px] text-gray-500">{t('vsLastMonth', 'vs last month')}</span>
              </div>
            </div>

            {/* Trust Metrics */}
            {[
              { label: t('transparencyIndex', 'Transparency Index'), value: 96, icon: 'visibility', description: t('allAiDecisionsIncludeFullReasoningChain', 'All AI decisions include full reasoning chain') },
              { label: t('contentSafety', 'Content Safety'), value: 99.8, icon: 'shield', description: t('azureContentSafetyFiltersActiveOnAllIo', 'Azure Content Safety filters active on all I/O') },
              { label: t('biasScore', 'Bias Score'), value: 2.1, icon: 'balance', description: t('lowBiasDetectedAcrossDemographicGroups', 'Low bias detected across demographic groups'), invert: true },
              { label: t('dataPrivacy', 'Data Privacy'), value: 100, icon: 'lock', description: t('zeroPersonalDataStoredDigipinbasedAnonymization', 'Zero personal data stored. DIGIPIN-based anonymization') },
              { label: t('uptimeSla', 'Uptime SLA'), value: 99.9, icon: 'speed', description: t('pwaOfflinePhi3MiniEnsuresAlwaysonAccess', 'PWA + offline Phi-3 Mini ensures always-on access') },
            ].map((m, i) => (
              <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4" style={{ animation: `fadeIn 0.4s ease-out ${i * 0.1}s both` }}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#FF9933]">{m.icon}</span>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{m.label}</h5>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{m.description}</p>
                  </div>
                  <span className={`text-lg font-black ${m.invert ? (m.value < 5 ? 'text-green-400' : 'text-red-400') : (m.value > 90 ? 'text-green-400' : 'text-amber-400')}`}>
                    {m.value}{m.invert ? '' : '%'}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'pulse' && (
          <NagarPulse />
        )}

        {tab === 'collective' && (() => {
          const activeClusters = getAllClusters();
          const myClusters = collectiveClusters;
          const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
            water: { icon: 'water_drop', color: '#06B6D4' },
            road: { icon: 'add_road', color: '#F59E0B' },
            sanitation: { icon: 'cleaning_services', color: '#10B981' },
            electricity: { icon: 'bolt', color: '#8B5CF6' },
          };

          return (
            <>
              {/* Header explanation */}
              <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 border border-[#8B5CF6]/15 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#8B5CF6] text-2xl mt-0.5">group_work</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('collectiveIssues', 'Collective Issues')}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 leading-snug mt-1">
                      {t('whenManyCitizensReportTheSameIssueItBecomesACollectiveComplaintAmplifyingYourVoiceAndPrioritizingResolution', 'When many citizens report the same issue, it becomes a collective complaint — amplifying your voice and prioritizing resolution.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* My joined clusters */}
              {myClusters.length > 0 && (
                <div className="bg-[#138808]/5 border border-[#138808]/15 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold text-[#138808] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {t('myCollectiveComplaints', 'My Collective Complaints')}
                  </h4>
                  <div className="space-y-2">
                    {myClusters.map((c, i) => {
                      const ci = CATEGORY_ICONS[c.category] || { icon: 'category', color: '#6B7280' };
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ci.color + '15' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ color: ci.color }}>{ci.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold capitalize">{t(c.category, c.category)} {t('issues', 'Issues')} — {t('zone', 'Zone')} {c.location}</p>
                            <p className="text-[9px] text-slate-500 dark:text-gray-400">{c.participantCount} {t('citizensJoined', 'citizens joined')} · {c.clusterId}</p>
                          </div>
                          <span className="text-[8px] font-bold text-[#138808] bg-[#138808]/10 px-1.5 py-0.5 rounded">{t('joined', 'Joined ✓')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Browse active clusters */}
              <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#FF9933]">campaign</span>
                  {t('activeCollectiveIssuesNearYou', 'Active Collective Issues Near You')}
                </h4>
                {!canJoinCollective && (
                  <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-[10px] text-amber-700 dark:text-amber-300">
                    <span className="font-bold">{t('unlockCollectiveActions', 'Unlock Collective Actions')}:</span>{' '}
                    {t('reachContributorLevelByIncreasingKarmaToJoinAndAmplifyCollectiveComplaints', 'Reach Contributor level by increasing Karma to join and amplify collective complaints.')}
                  </div>
                )}
                <div className="space-y-2.5">
                  {activeClusters.map((c, i) => {
                    const ci = CATEGORY_ICONS[c.category] || { icon: 'category', color: '#6B7280' };
                    const alreadyJoined = joinedIds.has(c.clusterId) || myClusters.some(mc => mc.clusterId === c.clusterId);
                    return (
                      <div key={i} className={`rounded-xl border overflow-hidden transition-all ${
                        alreadyJoined ? 'bg-[#138808]/5 border-[#138808]/20' : 'bg-white/60 dark:bg-white/[0.02] border-black/5 dark:border-white/5'
                      }`}>
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ci.color + '15' }}>
                            <span className="material-symbols-outlined text-lg" style={{ color: ci.color }}>{ci.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold capitalize">{t(c.category, c.category)} {t('issues', 'Issues')}</p>
                            <p className="text-[9px] text-slate-500 dark:text-gray-400">{t('zone', 'Zone')} {c.location} · {c.participantCount} {t('citizens', 'citizens')}</p>
                            <p className="text-[8px] text-slate-400 dark:text-gray-500 mt-0.5">{c.clusterId} · {c.status === 'amplified' ? t('EscalatedToOfficials', '🔊 Escalated to officials') : t('CollectingVoices', '📢 Collecting voices')}</p>
                          </div>
                        </div>
                        {!alreadyJoined ? (
                          <button
                            disabled={!canJoinCollective}
                            onClick={() => {
                              if (!canJoinCollective) return;
                              setJoinedIds(prev => new Set(prev).add(c.clusterId));
                              addCluster({ ...c, participantCount: c.participantCount + 1 });
                              addKarma(5);
                            }}
                            className={`w-full py-2 text-[10px] font-bold border-t transition-all ${
                              canJoinCollective
                                ? 'text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/10 hover:bg-[#8B5CF6]/10'
                                : 'text-slate-400 dark:text-gray-500 bg-black/5 dark:bg-white/[0.02] border-black/10 dark:border-white/10 cursor-not-allowed'
                            }`}
                          >
                            {canJoinCollective
                              ? `👥 ${t('joinThisCollective', 'Join This Collective')} (${c.participantCount}+ ${t('citizens', 'citizens')})`
                              : `🔒 ${t('contributorRoleRequired', 'Contributor role required')}`}
                          </button>
                        ) : (
                          <div className="w-full py-2 text-center text-[10px] font-bold text-[#138808] bg-[#138808]/5 border-t border-[#138808]/10">
                            ✓ {t('youveJoinedYourVoiceCounts', 'You\'ve joined · Your voice counts')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Trust Scores */}
              <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#138808]">verified</span>
                  {t('departmentPerformance', 'Department Performance')}
                </h4>
                <div className="space-y-2">
                  {getAllTrustScores().slice(0, 5).map((ts, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <div className="w-8 text-center shrink-0">
                        <p className="text-sm font-black" style={{ color: ts.color }}>{ts.score}</p>
                        <p className="text-[7px] text-slate-400">/10</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold">{t(ts.department, ts.department)}</p>
                        <p className="text-[8px] text-slate-400 dark:text-gray-500">⏱ {ts.avgResolutionDays}{t('dAvg', 'd avg')} · 📋 {ts.backlog} {t('pending', 'pending')}</p>
                      </div>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color: ts.color, backgroundColor: ts.color + '15' }}>{t(ts.label, ts.label)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
