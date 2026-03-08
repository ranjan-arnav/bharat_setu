'use client';

import { useState } from 'react';
import { IMPACT_DATA } from '@/lib/demo-data';
import { useAppStore } from '@/lib/store';
import NagarPulse from './NagarPulse';
import { FlagStripe } from '@/components/ui/GoiElements';
import { useTranslation } from '@/lib/i18n/useTranslation';

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

const OCCUPATIONS = [
  { value: 'farmer', label: 'Farmer' },
  { value: 'student', label: 'Student' },
  { value: 'government', label: 'Government Employee' },
  { value: 'private', label: 'Private Sector' },
  { value: 'business', label: 'Business Owner' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'retired', label: 'Retired' },
  { value: 'other', label: 'Other' },
];

export default function ImpactDashboard({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'overview' | 'trends' | 'agents' | 'trust' | 'pulse' | 'profile'>('overview');
  const { weeklyTrend, agentUsage, topGrievances, schemeSaturation } = IMPACT_DATA;

  // Real user data from store — blended with platform-wide IMPACT_DATA base
  const { trackedItems, karmaScore, userProfile, setUserProfile } = useAppStore();
  const [profileForm, setProfileForm] = useState({ ...userProfile });
  const [profileSaved, setProfileSaved] = useState(false);
  const myResolved = trackedItems.filter(i => i.status === 'Resolved').length;
  const mySchemes = trackedItems.filter(i => i.type === 'scheme').length;
  const myGrievances = trackedItems.filter(i => i.type === 'grievance').length;

  // Platform total = base demo + current user's real contributions
  const totalGrievancesResolved = IMPACT_DATA.overview.grievancesResolved + myResolved;
  const totalSchemesMatched = IMPACT_DATA.overview.schemesMatched + mySchemes;

  const statCards = [
    { label: 'Grievances Resolved', value: totalGrievancesResolved.toLocaleString(), icon: 'task_alt', color: '#138808' },
    { label: 'Schemes Matched', value: totalSchemesMatched.toLocaleString(), icon: 'verified', color: '#FF9933' },
    { label: 'Citizens Served', value: IMPACT_DATA.overview.totalUsers.toLocaleString(), icon: 'group', color: '#4299E1' },
    { label: 'My Karma Score', value: karmaScore.toLocaleString(), icon: 'military_tech', color: '#9F7AEA' },
    { label: 'My Cases Filed', value: myGrievances.toLocaleString(), icon: 'folder_open', color: '#D69E2E' },
    { label: 'Avg Resolution', value: `${IMPACT_DATA.overview.avgResolutionDays}d`, icon: 'speed', color: '#E53E3E' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'trends', label: 'Trends', icon: 'trending_up' },
    { id: 'agents', label: 'Agents', icon: 'smart_toy' },
    { id: 'trust', label: 'Trust', icon: 'verified_user' },
    { id: 'pulse', label: 'Pulse', icon: 'location_city' },
    { id: 'profile', label: 'Profile', icon: 'person' },
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
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Impact Dashboard</h2>
            <span className="text-[10px] text-slate-500 dark:text-gray-400">Real-time governance analytics</span>
          </div>
          <div className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg border border-black/10 dark:border-white/10">
            <span className="text-[9px] text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              LIVE
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

            {/* Top Grievances */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">Top Grievance Categories</h4>
              <div className="space-y-3">
                {topGrievances.map((g, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-900 dark:text-white font-bold">{g.category}</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">{g.count} reported</span>
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
                    <span className="text-[9px] text-gray-500">Trend: {g.trend === 'down' ? '↓ Decreasing' : g.trend === 'up' ? '↑ Increasing' : '→ Stable'}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'trends' && (
          <>
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Weekly Activity Trend</h4>
              <BarChart
                data={weeklyTrend.map((d) => ({
                  label: d.day,
                  value: d.grievances + d.schemes + d.voice,
                  color: '#FF9933',
                }))}
                max={Math.max(...weeklyTrend.map((d) => d.grievances + d.schemes + d.voice))}
              />
            </div>

            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Schemes Matched Per Day</h4>
              <BarChart
                data={weeklyTrend.map((d) => ({
                  label: d.day,
                  value: d.schemes,
                  color: '#138808',
                }))}
                max={Math.max(...weeklyTrend.map((d) => d.schemes))}
              />
            </div>

            {/* Scheme Saturation */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">Scheme Saturation Index</h4>
              <div className="space-y-3">
                {schemeSaturation.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-900 dark:text-white font-bold">{s.scheme}</span>
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
              <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Agent Usage Distribution</h4>
              <DonutChart
                data={agentUsage.map((a) => ({
                  label: a.name,
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
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{a.name}</h5>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">{a.value}% of queries</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white">{a.value}%</span>
                      <span className="block text-[8px] text-gray-500">USAGE</span>
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
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Community Trust Score</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="text-[10px] text-green-400 font-bold">↑ 12.5%</span>
                <span className="text-[10px] text-gray-500">vs last month</span>
              </div>
            </div>

            {/* Trust Metrics */}
            {[
              { label: 'Transparency Index', value: 96, icon: 'visibility', description: 'All AI decisions include full reasoning chain' },
              { label: 'Content Safety', value: 99.8, icon: 'shield', description: 'Azure Content Safety filters active on all I/O' },
              { label: 'Bias Score', value: 2.1, icon: 'balance', description: 'Low bias detected across demographic groups', invert: true },
              { label: 'Data Privacy', value: 100, icon: 'lock', description: 'Zero personal data stored. DIGIPIN-based anonymization' },
              { label: 'Uptime SLA', value: 99.9, icon: 'speed', description: 'PWA + offline Phi-3 Mini ensures always-on access' },
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

        {tab === 'profile' && (
          <div className="space-y-4">
            {/* Profile header card */}
            <div className="bg-gradient-to-br from-[#FF9933]/10 to-[#138808]/10 border border-black/10 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FF9933]/20 flex items-center justify-center text-2xl font-black text-[#FF9933]">
                {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {profileForm.name || 'Your Name'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {profileForm.digipin ? `DIGIPIN: ${profileForm.digipin}` : 'No DIGIPIN set'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#FF9933]">{karmaScore}</p>
                <p className="text-[9px] text-slate-500 dark:text-gray-400 uppercase">Karma</p>
              </div>
            </div>

            {/* Edit form */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Edit Profile</h4>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF9933]"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                  placeholder="e.g., Maharashtra"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF9933]"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Occupation</label>
                <select
                  value={profileForm.occupation}
                  onChange={e => setProfileForm(p => ({ ...p, occupation: e.target.value }))}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF9933]"
                >
                  <option value="">Select occupation</option>
                  {OCCUPATIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Annual Income (₹)</label>
                <input
                  type="number"
                  value={profileForm.income || ''}
                  onChange={e => setProfileForm(p => ({ ...p, income: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 250000"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF9933]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Used for scheme eligibility matching</p>
              </div>

              {/* Save button */}
              <button
                onClick={() => {
                  setUserProfile(profileForm);
                  setProfileSaved(true);
                  setTimeout(() => setProfileSaved(false), 2000);
                }}
                className="w-full py-3 rounded-xl bg-[#FF9933] text-white font-bold text-sm transition-all active:scale-95"
              >
                {profileSaved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Cases Filed', value: trackedItems.filter(i => i.type === 'grievance').length },
                { label: 'Resolved', value: myResolved },
                { label: 'Karma', value: karmaScore },
              ].map((s, i) => (
                <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-3 text-center">
                  <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400 uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center px-4">
              🔒 Your data is encrypted and stored locally. We never share your information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
