'use client';

import { getHotspots, getTrendInsights, getPredictions, getAllTrustScores, getAllClusters } from '@/lib/intelligence';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function CivicDigitalTwin() {
  const { t } = useTranslation();
  const hotspots = getHotspots();
  const trends = getTrendInsights();
  const predictions = getPredictions();
  const trustScores = getAllTrustScores();
  const clusters = getAllClusters();

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white overflow-y-auto pb-6 no-scrollbar">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#8B5CF6]">hub</span>
              {t('civicDigitalTwin', 'Civic Digital Twin')}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{t('aiPatternDetectionAndPredictions', 'AI-powered pattern detection & predictions')}</p>
          </div>
          <span className="text-[9px] font-bold text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> {t('live', 'LIVE')}
          </span>
        </div>

        {/* ═══ HOTSPOT MAP ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-red-400">location_on</span>
            {t('issueHotspots', 'Issue Hotspots')}
          </h4>
          <div className="space-y-2">
            {hotspots.map((h, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                h.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                h.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                'bg-amber-500/5 border-amber-500/20'
              }`}>
                <div className="flex flex-col items-center shrink-0">
                  <span className={`text-lg font-black ${
                    h.severity === 'critical' ? 'text-red-500' : h.severity === 'high' ? 'text-orange-500' : 'text-amber-500'
                  }`}>{h.count}</span>
                  <span className="text-[7px] text-slate-400 dark:text-gray-500 uppercase">{t('cases', 'cases')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold">{t(h.category, h.category)}</p>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400">{t(h.location, h.location)} · {t(h.ward, h.ward)}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    h.trend === 'rising' ? 'text-red-500 bg-red-500/10' :
                    h.trend === 'declining' ? 'text-green-500 bg-green-500/10' :
                    'text-slate-500 dark:text-gray-400 bg-black/5 dark:bg-white/5'
                  }`}>
                    {h.trend === 'rising' ? t('risingTrend', '↑ Rising') : h.trend === 'declining' ? t('decliningTrend', '↓ Declining') : t('stableTrend', '→ Stable')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TREND INSIGHTS ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#3B82F6]">trending_up</span>
            {t('trendAnalysis', 'Trend Analysis')}
          </h4>
          <div className="space-y-3">
            {trends.map((trend, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: trend.color + '15' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: trend.color }}>{trend.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold">{t(trend.category, trend.category)}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      trend.direction === 'up' ? 'text-red-500 bg-red-500/10' :
                      trend.direction === 'down' ? 'text-green-500 bg-green-500/10' :
                      'text-slate-500 bg-black/5 dark:bg-white/5'
                    }`}>
                      {trend.direction === 'up' ? `↑ ${trend.change}%` : trend.direction === 'down' ? `↓ ${Math.abs(trend.change)}%` : `→ ${trend.change}%`}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400 leading-snug">{t(trend.description, trend.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ AI PREDICTIONS ═══ */}
        <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-[#8B5CF6]/10 border border-[#8B5CF6]/15 rounded-2xl p-4">
          <h4 className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            {t('aiPredictions', 'AI Predictions')}
            <span className="ml-auto text-[8px] font-bold text-slate-400 dark:text-gray-500 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{t('simulated', 'Simulated')}</span>
          </h4>
          <div className="space-y-2.5">
            {predictions.map((p, i) => (
              <div key={i} className="bg-white/60 dark:bg-white/[0.03] rounded-xl p-3 border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="material-symbols-outlined text-lg" style={{ color: p.color }}>{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold">{t(p.category, p.category)}</p>
                    <p className="text-[9px] text-slate-500 dark:text-gray-400">{t(p.area, p.area)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black" style={{ color: p.color }}>{p.probability}%</p>
                    <p className="text-[8px] text-slate-400 dark:text-gray-500">{t('likelihood', 'likelihood')}</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 dark:text-gray-400 italic leading-snug">⏱ {t(p.timeframe, p.timeframe)} — {t(p.reasoning, p.reasoning)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ COLLECTIVE ACTION CLUSTERS ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#FF9933]">group_work</span>
            {t('activeCollectiveActions', 'Active Collective Actions')}
          </h4>
          <div className="space-y-2">
            {clusters.map((c, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                c.status === 'amplified' ? 'bg-[#138808]/5 border-[#138808]/20' : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5'
              }`}>
                <div className="text-center shrink-0">
                  <p className="text-lg font-black text-[#FF9933]">{c.participantCount}</p>
                  <p className="text-[7px] text-slate-400 dark:text-gray-500 uppercase">{t('citizens', 'citizens')}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold capitalize">{t('categoryIssues', '{category} Issues').replace('{category}', t(c.category, c.category))}</p>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400">Zone {c.location} · {c.clusterId}</p>
                </div>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                  c.status === 'amplified' ? 'text-[#138808] bg-[#138808]/10' : 'text-amber-500 bg-amber-500/10'
                }`}>
                  {c.status === 'amplified' ? t('amplified', '🔊 Amplified') : t('active', '📢 Active')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ DEPARTMENT TRUST SCORES ═══ */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#138808]">verified</span>
            {t('departmentTrustScores', 'Department Trust Scores')}
          </h4>
          <div className="space-y-2">
            {trustScores.map((ts, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <div className="w-10 text-center shrink-0">
                  <p className="text-base font-black" style={{ color: ts.color }}>{ts.score}</p>
                  <p className="text-[7px] text-slate-400 dark:text-gray-500">/ 10</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-bold">{t(ts.department, ts.department)}</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color: ts.color, backgroundColor: ts.color + '15' }}>{ts.label}</span>
                  </div>
                  <div className="flex gap-3 text-[8px] text-slate-400 dark:text-gray-500">
                    <span>⏱ {ts.avgResolutionDays}d avg</span>
                    <span>📋 {ts.backlog} pending</span>
                    <span>⭐ {ts.satisfaction}/5</span>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-sm ${
                  ts.trend === 'up' ? 'text-green-500' : ts.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {ts.trend === 'up' ? 'trending_up' : ts.trend === 'down' ? 'trending_down' : 'trending_flat'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
